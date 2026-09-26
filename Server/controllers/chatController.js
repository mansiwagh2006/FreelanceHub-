const Chat = require('../models/Chat');

// Send a message in a project's chat (creates the chat if it doesn't exist yet)
exports.sendMessage = async (req, res) => {
  try {
    const { projectId, text, fileUrl } = req.body;
    const senderId = req.user.userId;

    let chat = await Chat.findOne({ project: projectId });

    const newMessage = { sender: senderId, text, fileUrl };

    if (chat) {
      chat.messages.push(newMessage);
      await chat.save();
    } else {
      chat = await Chat.create({
        project: projectId,
        messages: [newMessage]
      });
    }

    res.status(200).json(chat);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Get the full chat history for a project
exports.getChatByProject = async (req, res) => {
  try {
    const chat = await Chat.findOne({ project: req.params.projectId })
      .populate('messages.sender', 'name email profilePic');

    if (!chat) {
      return res.status(200).json({ project: req.params.projectId, messages: [] });
    }

    res.status(200).json(chat);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};