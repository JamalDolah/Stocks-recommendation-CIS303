document.getElementById('stockForm').addEventListener('submit', async function(event) {
    event.preventDefault();
    
    const stocksInput = document.getElementById('stocksInput').value;
    const userStocks = stocksInput.split(',').map(stock => stock.trim()).slice(0, 3);

    try {
        const response = await fetch('http://localhost:3000/recommended-stocks', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ userStocks }),
        });

        if (!response.ok) {
            throw new Error('Failed to fetch recommended stocks');
        }

        const data = await response.json();
        displayRecommendedStocks(data.recommendedStocks);
    } catch (error) {
        console.error('Error fetching recommended stocks:', error);
    }
});

function displayRecommendedStocks(recommendedStocks) {
    const recommendedStocksContainer = document.getElementById('recommendedStocks');
    recommendedStocksContainer.innerHTML = `
        <h2>Recommended Stocks:</h2>
        <ul>
            ${recommendedStocks.map((stock, index) => `<li key="${index}">${stock}</li>`).join('')}
        </ul>
    `;
}
