const express = require('express');
const crypto = require('crypto');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3000;

// Подпись (секретный ключ из Mango)
const SIGNATURE_KEY = process.env.MANGO_SIGNATURE || 'your-secret-here';

app.use(bodyParser.json());

app.post('/mango/status_hook', (req, res) => {
    const receivedSignature = req.headers['x-signature'];
    const payload = JSON.stringify(req.body);
    const calculatedSignature = crypto
        .createHmac('sha256', SIGNATURE_KEY)
        .update(payload)
        .digest('hex');

    if (receivedSignature !== calculatedSignature) {
        console.log('❌ Неверная подпись!');
        return res.status(403).send('Forbidden');
    }

    console.log('✅ Подпись проверена. Получен webhook:');
    console.log(JSON.stringify(req.body, null, 2));

    // Здесь можно сохранить данные в базу, отправить в Telegram и т.д.

    res.status(200).send('OK');
});

app.get('/', (req, res) => {
    res.send('Mango webhook работает!');
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
