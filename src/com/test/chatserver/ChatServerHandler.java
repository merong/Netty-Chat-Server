package com.test.chatserver;



import com.google.gson.Gson;
import com.google.gson.JsonObject;
import com.google.gson.JsonParseException;
import com.google.gson.JsonParser;

import Schema.Chat;
import Schema.Message;
import game.RPS;
import io.netty.buffer.ByteBuf;
import io.netty.buffer.Unpooled;
import io.netty.channel.Channel;
import io.netty.channel.ChannelFuture;
import io.netty.channel.ChannelFutureListener;
import io.netty.channel.ChannelHandlerAdapter;
import io.netty.channel.ChannelHandlerContext;
import io.netty.channel.ChannelInboundHandlerAdapter;
import io.netty.channel.SimpleChannelInboundHandler;
import io.netty.channel.group.ChannelGroup;
import io.netty.channel.group.DefaultChannelGroup;
import io.netty.handler.codec.http.websocketx.BinaryWebSocketFrame;
import io.netty.handler.codec.http.websocketx.CloseWebSocketFrame;
import io.netty.handler.codec.http.websocketx.PongWebSocketFrame;
import io.netty.handler.codec.http.websocketx.TextWebSocketFrame;
import io.netty.handler.codec.http.websocketx.WebSocketFrame;
import io.netty.util.CharsetUtil;
import io.netty.util.ReferenceCountUtil;
import io.netty.util.concurrent.GlobalEventExecutor;

import java.nio.ByteBuffer;
import java.sql.Timestamp;
import java.time.Instant;
import java.time.ZoneOffset;
import java.time.ZonedDateTime;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Calendar;
import java.util.Date;
import java.util.List;
import java.util.Stack;

/**
 * Handles a server-side chat channel. Tail of the pipeline for incoming data.
 */
public class ChatServerHandler extends ChannelInboundHandlerAdapter { // (1
	
    private final List<NamedChannelGroup> lobbies;
    private final ChannelGroup globalChannelGroup;
    private final String username;
    private Channel ch;
    private boolean init = false;

    private NamedChannelGroup currentLobby;
    private List<GameLobby> gameLobbies;
       
    public ChatServerHandler(ChannelHandlerContext ctx, String username, List<NamedChannelGroup> lobbies,
            ChannelGroup allChannels, List<GameLobby> gameLobbies) {
        this.username = username;
        this.lobbies = lobbies;
        this.globalChannelGroup = allChannels;
        this.ch = ctx.channel();
        this.gameLobbies = gameLobbies;
    }

    @Override
    public void channelInactive(ChannelHandlerContext ctx) throws Exception {
        super.channelInactive(ctx);
        System.out.println("[ChatServerHandler] Disconnecting user: " + username);
        //remove username from current channelGroup
        currentLobby.remove(username);
        System.out.println("[ChatServerHandler] Num users in lobby: " + currentLobby.size());
        
    }
    
	@Override
	public void channelRead(ChannelHandlerContext ctx, Object msg) throws Exception 
	{
		System.out.println("\n[ChatServerHandler] channelRead called!");
		
		if (!init) {
		    
	        addChannelToGlobalGroup(this.ch);
	        if (!addUserToFirstLobby(this.ch, username)) {
	            ctx.close();
	            return;
	        }
	        
            ch.writeAndFlush(new BinaryWebSocketFrame(lobbyConnectMessage()));
            currentLobby.write(new BinaryWebSocketFrame(lobbyUserList(currentLobby)));
	                
	        init = true;	        
	        return;
		}
		
		if ((msg instanceof TextWebSocketFrame)) {
			System.out.println("[ChatServerHandler] received TextWebSocketFrame!\n------");	
			String strMsg = ((TextWebSocketFrame) msg).text();
			
			if (strMsg.equalsIgnoreCase("/lobbies")) {
			    
	            ch.writeAndFlush(new BinaryWebSocketFrame(lobbiesData()));
	          
	            return;
			}
			if (strMsg.equalsIgnoreCase("/lobby")) {

			    ch.writeAndFlush(lobbyConnectMessage());
	            return;
			}
			if (strMsg.startsWith("/connect ")) {
			    //get lobby name
			    String lobbyName = strMsg.substring(9);
			    if (lobbyName.contentEquals(currentLobby.name())) {
			        return;
			    }
			    
			    if (connectToLobby(lobbyName)) {
                    ch.writeAndFlush(new BinaryWebSocketFrame(lobbyConnectMessage()));
                    currentLobby.writeAndFlush(new BinaryWebSocketFrame(lobbyUserList(currentLobby)));
                    ch.writeAndFlush(new BinaryWebSocketFrame(lobbiesData()));
			    }
			    return;
			}
			else if (strMsg.contentEquals("rock") || strMsg.contentEquals("paper") || strMsg.contentEquals("scissors")) {
			    ctx.fireChannelRead(msg);
			    return;
			}
			else if (strMsg.startsWith("/play rps ")) {
			    String gameLobbyName = strMsg.substring(10);
			    if (gameLobbies.isEmpty()){
			        return;
			    }
			    
			    NamedChannelGroup gameLobby = null;
			    for (int i = 0 ; i < gameLobbies.size(); i++) {
			        if (gameLobbyName.contentEquals(gameLobbies.get(i).name())) {
			            gameLobby = gameLobbies.get(i);
			            break;
			        }
			    }
			    if (gameLobby == null) {
			        return;
			    }
			    
			    gameLobby.add(ch, username);

			    ArrayList<String> players = gameLobby.getUsers();
			    
			    RPS rpsGame = null;
			    try {
			        rpsGame = new RPS(2, players);
                }
                catch (Exception e) {
                    // TODO Auto-generated catch block
                    e.printStackTrace();
                    return;
                }
			    
			    System.out.println("[ChatServerHandler] Successfully created game lobby " + gameLobby.name());
			    System.out.println("[ChatServerHandler] Users: " + gameLobby.getUsers());
			    
			    
			    for (Channel chan : gameLobby) {
			        chan.pipeline().addLast("gameHandler", new ServerGameHandler(rpsGame, gameLobby));
			    }
			    
			    gameLobbies.remove(gameLobby);
			    return;
			    
			}
			else if (strMsg.contentEquals("/play rps")) {
			    System.out.println("[ChatServerHandler] Received RPS request");
			    GameLobby rpsLobby = new GameLobby("RPS", GlobalEventExecutor.INSTANCE, "rps");
			    gameLobbies.add(rpsLobby);
			 
			    //add the person who made the game, their username, and channel map
			    rpsLobby.add(ch, username);
			    
			    System.out.println("Made new game lobby for rps named: " + rpsLobby.name());
			    System.out.println("People in lobby: " + rpsLobby.getUsers());
			    
			    return;
			}
			else if (strMsg.contentEquals("/games")) {
                ch.writeAndFlush(new BinaryWebSocketFrame(gameLobbiesData()));
                
                return;
			}
            //Stamp message with current time
            TimeChatMessage timeMessage = new TimeChatMessage(username, strMsg);
            
            ByteBuffer data = FlatBuffersCodec.chatToByteBuffer(timeMessage);
            ByteBuf buf = Unpooled.copiedBuffer(data);
            
            
            
            currentLobby.writeAndFlush(new BinaryWebSocketFrame(buf));
            
		}
		else if (msg instanceof ByteBuf) {
		    System.out.println("[ChatServerHandler] Received ByteBuf");
		    ByteBuf buf = (ByteBuf) msg;
		    
		    //Get the lobby id
		    short lobbyID = buf.getShort(0);
		    
		    //Get the last 12 bytes and put it into a byte array
		    //First two bytes are used for lobby identification only
		    byte[] slice = new byte[12];
		    buf.slice(2, 12).readBytes(slice);
		    System.out.println("Slice: " + Arrays.toString(slice));
		    
		    System.out.println("[ChatServerHandler] Received ByteBuf: " +
		    "Lobby ID: " + lobbyID + "\n" +
		    "Sender: " + buf.getInt(2) + "\n" +
		    "Receiver: " + buf.getInt(6) + "\n" +
		    "Val: " + buf.getInt(10));
		    
		    //Broadcast the byte array to everyone with same channel (lobby id)
		    //For now this is just broadcast to all users
		    ByteBuf myBuf = Unpooled.copiedBuffer(slice);
            WebSocketFrame deltaArr = new BinaryWebSocketFrame(myBuf);
            globalChannelGroup.writeAndFlush(deltaArr);
		}
		else if (msg instanceof CloseWebSocketFrame) {
		    System.out.println("[ChatServerHandler] Received request to close connection");
		    System.out.println("[ChatServerHandler] Channel grp before removal: " + globalChannelGroup.toString());
		    
		    final String dcMsg = username + " disconnected";
		    //try to close connection
            ChannelFuture cf = ctx.channel().close();
            /*
            cf.addListener(new ChannelFutureListener() {
                public void operationComplete(ChannelFuture future) {
                    //Broadcast removal of user from channel group to all channels connected
                    if (!channels.isEmpty()) {
                        TextWebSocketFrame dcFrame = new TextWebSocketFrame(dcMsg);
                        channels.writeAndFlush(dcFrame);
                    }
                }
            });
            */
		}
		else {
			System.out.println("[ChatServerHandler] received unknown type of frame!");
		}
			
		
		
		
	}
	
	/**
	 * Attempts to add aChannel to the first NamedChannelGroup (lobby) that
	 * it can find in lobbies. Returns true if aChannel and aUsername were
	 * successfully placed in one of the lobbies, false otherwise.
	 * 
	 * @param aChannel   a Channel
	 * @param aUsername  Username corresponding to aChannel
	 * @return           True if aChannel and aUsername were placed in the same
	 *                   NamedChannelGroup in lobbies, false otherwise
	 */
    private boolean addUserToFirstLobby(Channel aChannel, String aUsername) {
        for (int i = 0; i < lobbies.size(); i++) {

            if (lobbies.get(i).isFull() || lobbies.get(i).contains(aChannel) 
                    || lobbies.get(i).contains(aUsername)){
                continue;
            }
            
            if (!lobbies.get(i).add(ch, username)) {
                return false;
            }

            currentLobby = lobbies.get(i);
            return true;
        }
        
        return false;
    }
    
    /**
     * Attempts to place this channel and corresponding username into the
     * NamedChannelGroup in lobbies indicated by lobbyName.
     * 
     * Returns false if the user is already in the lobby or if placement
     * in the NamedChannelGroup fails for any other reason. Otherwise,
     * the user is placed into the NamedChannelGroup with name lobbyName
     * and returns true.
     * 
     * @param lobbyName Name of the lobby to connect to
     * @return          True if the connection was successful, 
     *                  false otherwise.
     */
    private boolean connectToLobby(String lobbyName) {
        for (int i = 0; i < lobbies.size(); i++) {
            if (lobbyName.equals(lobbies.get(i).name()) && 
                !lobbies.get(i).isFull() &&
                !lobbies.get(i).contains(ch) && 
                !lobbies.get(i).contains(username)) {
            
                currentLobby.remove(ch);
                
                currentLobby = lobbies.get(i);
                currentLobby.add(ch, username);
                
                return true;
                

                
                
            }
        }
        return false;
    }
    
    /**
     * Returns a ByteBuf of the list of server lobbies serialized with FlatBuffers.
     * Each entry in the list is in the following format:
     * lobbyName,numUserInLobby/lobbyCapacity
     * 
     * For example, the lobby MyLobby with 3 users connected out of a maximum of 10
     * would be recorded in the list as;
     * MyLobby,3/10
     * 
     * 
     * 
     * @see {@link Schema.List}
     * 
     * @return ByteBuf containing list of NamedChannelGroups in lobbies.
     */
    private ByteBuf lobbiesData() {
        String[] lobbyList = new String[lobbies.size()];
        
        for (int j = 0; j < lobbies.size(); j++) {
            lobbyList[j] = lobbies.get(j).lobbyInfo();
        }
        
        ByteBuffer lobbyData = FlatBuffersCodec.listToByteBuffer("lobbies", lobbyList);
        return Unpooled.copiedBuffer(lobbyData);
    }
    
    private ByteBuf gameLobbiesData() {
        int numGameLobbies = gameLobbies.size();
        String[] gameLobbyList = new String[numGameLobbies];
        
        for (int i = 0; i < numGameLobbies; i++) {
            gameLobbyList[i] = gameLobbies.get(i).lobbyInfo();
        }
        
        ByteBuffer gameLobbyData = FlatBuffersCodec.listToByteBuffer("games", gameLobbyList);
        return Unpooled.copiedBuffer(gameLobbyData);
    }

    private ByteBuf lobbyConnectMessage() {
        TimeChatMessage timeMessage = new TimeChatMessage("Server", "You are now connected to "
                + currentLobby.name());
        ByteBuffer data = FlatBuffersCodec.chatToByteBuffer(timeMessage);
        return Unpooled.copiedBuffer(data);
    }

    private ByteBuf lobbyUserList(NamedChannelGroup lobby) {
        ArrayList<String> users = lobby.getUsers();
        
        //Prefix user list with lobby name
        users.add(0, lobby.name());
        
        String[] userList = users.toArray(new String[users.size()]);
        ByteBuffer buffer =  FlatBuffersCodec.listToByteBuffer("users", userList);
        return Unpooled.copiedBuffer(buffer);
    }

    /**
     * Adds user to the Global channel group
     */
    private void addChannelToGlobalGroup(Channel aChannel) {
        globalChannelGroup.add(aChannel);
        
    }

    /**
     * Generates a Message containing RPS challenge info in a ByteBuf.
     * @param chalenger    Person initiating RPS challenge
     * @param challenged   Receiving RPS challenge
     * @return             Challenge FlatBuffers Message in ByteBuf format
     */
    private ByteBuf makeChallengeMessageBuf(String challenger, String challenged) {
        String challengeMessage = challenged + ", " + challenger + " wants to play"
                + " Rock, Paper, Scissors!";
        
        TimeChatMessage msg = new TimeChatMessage("Server", challengeMessage);
        ByteBuffer buf = FlatBuffersCodec.chatToByteBuffer(msg);
        
        return Unpooled.copiedBuffer(buf);
    }

    @Override
    public void exceptionCaught(ChannelHandlerContext ctx, Throwable cause) { // (4)
        // Close the connection when an exception is raised.
        cause.printStackTrace();
        ctx.close();
    }


}