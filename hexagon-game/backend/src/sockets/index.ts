import { Server, Socket } from 'socket.io';
import { db } from '../database';
import { users, chatMessages } from '../database/schema';
import { eq } from 'drizzle-orm';

export const socketHandler = (io: Server) => {
  io.on('connection', (socket: Socket) => {
    console.log('User connected:', socket.id);

    // Handle user joining a room
    socket.on('join-room', async (data) => {
      const { userId, roomId } = data;
      
      try {
        // Verify user exists
        const [user] = await db.select().from(users).where(eq(users.id, userId)).limit(1);
        
        if (user) {
          socket.join(roomId);
          
          // Update user's online status
          await db.update(users).set({ isOnline: true }).where(eq(users.id, userId));
          
          // Notify others in the room
          socket.to(roomId).emit('user-joined', { userId, username: user.username });
        }
      } catch (error) {
        console.error('Join room error:', error);
      }
    });

    // Handle sending chat messages
    socket.on('send-message', async (data) => {
      const { userId, channelId, message } = data;
      
      try {
        // Verify user exists
        const [user] = await db.select().from(users).where(eq(users.id, userId)).limit(1);
        
        if (!user) {
          return;
        }

        // Save message to database
        const [newMessage] = await db.insert(chatMessages).values({
          userId,
          channelId,
          message,
          createdAt: new Date(),
        }).returning();

        // Broadcast message to channel
        io.to(channelId).emit('new-message', {
          id: newMessage.id,
          userId: user.id,
          username: user.username,
          message: newMessage.message,
          timestamp: newMessage.createdAt,
        });
      } catch (error) {
        console.error('Send message error:', error);
      }
    });

    // Handle placing a building
    socket.on('place-building', async (data) => {
      const { userId, cityId, buildingData } = data;
      
      // Verify user has permission to modify this city
      // Emit the building placement to other players in the same city
      socket.to(`city-${cityId}`).emit('building-placed', {
        userId,
        cityId,
        buildingData
      });
    });

    // Handle updating game state
    socket.on('update-game-state', async (data) => {
      const { userId, cityId, gameState } = data;
      
      // Process game state update
      socket.to(`city-${cityId}`).emit('game-state-updated', {
        userId,
        cityId,
        gameState
      });
    });

    // Handle disconnection
    socket.on('disconnect', async () => {
      console.log('User disconnected:', socket.id);
      
      // In a real implementation, you'd get the user ID from the socket session
      // For now, we'll skip updating the online status
    });
  });
};