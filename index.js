const apiUrl = 'https://82874cb7-7cf0-4525-99ad-b92eccae1aaa-00-3bqgt2l7n7jni.picard.replit.dev';

async function encryptMessage() {
    try {
        const message = document.getElementById('message').value;
        const response = await fetch(`${apiUrl}/encrypt`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message })
        });

        if (!response.ok) throw new Error('Erro na requisição');
        const data = await response.json();
        document.getElementById('result').innerText = `Criptografado: ${data.encrypted}\nIV: ${data.iv}`;
    } catch (error) {
        console.error('Erro:', error);
        alert('Ocorreu um erro ao criptografar a mensagem.');
    }
}

async function decryptMessage() {
    try {
        const [encrypted, iv] = document.getElementById('result').innerText.split('\n').map(line => line.split(': ')[1]);
        const response = await fetch(`${apiUrl}/decrypt`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ encrypted, iv })
        });

        if (!response.ok) throw new Error('Erro na requisição');
        const data = await response.json();
        document.getElementById('result').innerText = `Descriptografado: ${data.decrypted}`;
    } catch (error) {
        console.error('Erro:', error);
        alert('Ocorreu um erro ao descriptografar a mensagem.');
    }
}