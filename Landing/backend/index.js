import express from 'express';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Health check
app.get('/', (req, res) => {
  res.send('Backend is running');
});

// WhatsApp message endpoint (to be implemented)
app.post('/api/send-whatsapp', async (req, res) => {
  // TODO: Integrate WhatsApp bot logic here
  res.json({ success: true, message: 'Message endpoint hit', data: req.body });
});

app.listen(PORT, () => {
  console.log(`Backend server running on port ${PORT}`);
});
