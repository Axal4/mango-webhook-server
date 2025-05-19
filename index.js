import express from 'express';
import bodyParser from 'body-parser';
import crypto from 'crypto';

const app = express();
const PORT = process.env.PORT || 3000;
const SIGNATURE_KEY = process.env.MANGO_SIGNATURE || 'your-secret';

app.use(bodyParser.json());

app.post('/mango/status_hook', (req, res) => {
    const signature = req.headers['x-signature'];
    const payload = JSON.stringify(req.body);

    const expectedSignature = crypto
        .createHmac('sha256', SIGNATURE_KEY)
        .update(payload)
        .digest('hex');

    if (signature !== expectedSignature) {
        console.log('❌ Неверная подпись');
        return res.status(403).send('Forbidden');
    }

    console.log('✅ Получен вебхук:');
    console.log(JSON.stringify(req.body, null, 2));

    res.status(200).send('OK');
});

app.listen(PORT, () => {
    console.log(`✅ Сервер запущен на порту ${PORT}`);
});

