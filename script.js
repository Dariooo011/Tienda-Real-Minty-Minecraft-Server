let nauticName = '';
let nauticBalance = 0;
let products = [];
let currentProduct = null;

fetch('products.json')
    .then(response => response.json())
    .then(data => {
        products = data;
        displayProducts();
    });

document.getElementById('nauticForm').addEventListener('submit', function(e) {
    e.preventDefault();
    nauticName = document.getElementById('name').value;
    nauticBalance = parseInt(document.getElementById('balance').value);

    if (nauticBalance > 4000000) {
        alert('Balance cannot exceed 4M');
        return;
    }

    document.getElementById('userForm').classList.add('hidden');
    document.getElementById('store').classList.remove('hidden');
    document.getElementById('userHeader').classList.remove('hidden');
    updateUserHeader();
});

function updateUserHeader() {
    document.getElementById('userName').textContent = `${nauticName}`;
    document.getElementById('userBalance').textContent = `Balance: $${nauticBalance.toLocaleString()}`;
}

function displayProducts() {
    const productList = document.getElementById('productList');
    products.forEach(product => {
        const productElement = document.createElement('div');
        productElement.className = 'bg-gray-800 shadow-lg rounded-lg p-6 flex flex-col justify-between';
        productElement.innerHTML = `
            <div>
                <h3 class="text-2xl font-semibold mb-2 text-mint">${product.nombre}</h3>
                <p class="text-gray-300 mb-4">Price: $${product.precio.toLocaleString()}</p>
            </div>
            <button onclick="showConfirmation('${product.nombre}')" class="bg-mint hover:bg-green-400 text-gray-900 font-bold py-2 px-4 rounded-lg transition duration-300">
                Buy
            </button>
        `;
        productList.appendChild(productElement);
    });
}

function showConfirmation(productName) {
    currentProduct = products.find(p => p.nombre === productName);
    const modal = document.getElementById('confirmationModal');
    const message = document.getElementById('confirmationMessage');
    message.textContent = `Are you sure you want to buy ${productName} for $${currentProduct.precio.toLocaleString()}?`;
    modal.classList.remove('hidden');
    modal.classList.add('flex');
}

document.getElementById('cancelPurchase').addEventListener('click', function() {
    document.getElementById('confirmationModal').classList.add('hidden');
    document.getElementById('confirmationModal').classList.remove('flex');
});

document.getElementById('confirmPurchase').addEventListener('click', function() {
    document.getElementById('confirmationModal').classList.add('hidden');
    document.getElementById('confirmationModal').classList.remove('flex');
    buyProduct(currentProduct.nombre);
});

function buyProduct(productName) {
    const product = products.find(p => p.nombre === productName);
    if (nauticBalance >= product.precio) {
        nauticBalance -= product.precio;
        updateUserHeader();
        displayPurchaseResult(`Congratulations! You bought ${productName} for $${product.precio.toLocaleString()}. Your remaining balance is $${nauticBalance.toLocaleString()}.`, true);
        sendWebhook(productName, product.precio);
    } else {
        displayPurchaseResult(`Sorry, you don't have enough balance to buy ${productName}.`, false);
    }
}

function displayPurchaseResult(message, success) {
    const resultElement = document.getElementById('purchaseResult');
    resultElement.textContent = message;
    resultElement.classList.remove('hidden', 'bg-green-800', 'bg-red-800');
    resultElement.classList.add(success ? 'bg-green-800' : 'bg-red-800');
    resultElement.classList.add('animate-pulse');
    setTimeout(() => {
        resultElement.classList.remove('animate-pulse');
    }, 1000);
}

function sendWebhook(productName, price) {
    const webhookUrl = 'https://discord.com/api/webhooks/1299667422676254720/GFRylDF7qB9_vlWfDtMnaJCNh-TJaVcVR2O-kryTs0RcaPvk6ShXJP0zfWHv04H1MfiI';
    const message = {
        content: "<@1269954450961731647> A new purchase has been made!",
        embeds: [{
            title: "New Purchase in Real-Minty Store",
            color: 0x98ff98, // Mint color
            fields: [
                {
                    name: "Customer",
                    value: nauticName,
                    inline: true
                },
                {
                    name: "Product",
                    value: productName,
                    inline: true
                },
                {
                    name: "Price",
                    value: `$${price.toLocaleString()}`,
                    inline: true
                },
                {
                    name: "Remaining Balance",
                    value: `$${nauticBalance.toLocaleString()}`,
                    inline: true
                }
            ],
            timestamp: new Date().toISOString(),
            footer: {
                text: "Real-Minty Store"
            }
        }]
    };

    fetch(webhookUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(message),
    })
    .then(response => console.log('Webhook sent successfully'))
    .catch(error => console.error('Error sending webhook:', error));
}