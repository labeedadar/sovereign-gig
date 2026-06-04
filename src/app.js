// Sovereign-Gig Web App - Fiat Primary Core

const freelancerProfile = {
    min_budget: 500,
    preferred_tech: ["python", "react", "solidity", "ai", "node", "web3"],
    dealbreakers: ["unpaid", "equity only", "homework", "test task", "logo"],
    payment_preferences: {
        primary: "Bank Transfer / Stripe",
        secondary: "USDC (Stablecoin)"
    }
};

// --- Signal Filter Logic ---
window.analyzeSignal = function() {
    const input = document.getElementById('jobInput').value.toLowerCase();
    const resultDiv = document.getElementById('signalResult');
    
    if (!input) {
        alert("Please paste a job description first.");
        return;
    }

    let score = 50; 
    let notes = [];

    // Tech Match
    const matches = freelancerProfile.preferred_tech.filter(t => input.includes(t));
    if (matches.length > 0) {
        score += 30;
        notes.push(`✅ Matches: ${matches.join(', ')}`);
    }

    // Dealbreakers
    const violations = freelancerProfile.dealbreakers.filter(d => input.includes(d));
    if (violations.length > 0) {
        score -= 60;
        notes.push(`❌ Dealbreaker found: ${violations.join(', ')}`);
    }

    // Payment Intent Detection
    if (input.includes("crypto") || input.includes("eth") || input.includes("bitcoin")) {
        notes.push("💡 Note: Client mentioned Crypto.");
    } else {
        notes.push("💵 Note: Standard Fiat payment likely.");
    }

    // Display Results
    resultDiv.classList.remove('hidden', 'animate-pulse');
    resultDiv.className = `mt-4 p-4 rounded-xl border-2 ${score >= 70 ? 'bg-green-900/30 border-green-500' : (score >= 40 ? 'bg-yellow-900/30 border-yellow-500' : 'bg-red-900/30 border-red-500')}`;
    
    resultDiv.innerHTML = `
        <h3 class="font-bold text-lg mb-2">Signal Score: ${Math.max(0, Math.min(100, score))}/100</h3>
        <ul class="text-xs space-y-1 opacity-90">
            ${notes.map(n => `<li>${n}</li>`).join('')}
        </ul>
        <div class="mt-4 pt-3 border-t border-white/10 text-sm font-bold">
            ${score >= 70 ? '🚀 HIGH SIGNAL - Send Proposal & Bank Details.' : (score >= 40 ? '🤔 MEDIUM SIGNAL - Ask for budget first.' : '🛑 LOW SIGNAL - Likely a waste of time.')}
        </div>
    `;
};

// --- Fiat Helpers ---
window.copyBankDetails = function() {
    const holder = document.getElementById('bankHolder').innerText;
    const account = document.getElementById('bankAccount').innerText;
    const swift = document.getElementById('bankSwift').innerText;
    const text = `Bank Transfer Details:\nHolder: ${holder}\nIBAN/Account: ${account}\nSWIFT/BIC: ${swift}`;
    navigator.clipboard.writeText(text);
    alert("Bank details copied to clipboard!");
};

window.copyPayLink = function() {
    const link = document.getElementById('payLink').value;
    navigator.clipboard.writeText(link);
    alert("Payment link copied!");
};

// --- Web3 / Escrow Logic ---
let signer;
const ABI = [
    "function releaseFunds() external",
    "function refundClient() external"
];

document.getElementById('connectWallet').onclick = async () => {
    if (window.ethereum) {
        try {
            const provider = new ethers.BrowserProvider(window.ethereum);
            signer = await provider.getSigner();
            const address = await signer.getAddress();
            document.getElementById('walletStatus').innerText = `Connected: ${address.substring(0,6)}...${address.substring(38)}`;
            document.getElementById('connectWallet').innerText = "Linked";
            document.getElementById('connectWallet').className = "bg-green-600 text-white font-bold py-2 px-6 rounded-lg text-xs";
        } catch (err) {
            console.error(err);
            alert("Connection failed.");
        }
    } else {
        alert("MetaMask not found! Open in MetaMask Browser on Mobile.");
    }
};

window.releaseFunds = async function() {
    const address = document.getElementById('escrowAddress').value;
    if (!ethers.isAddress(address)) return alert("Invalid Contract Address");
    if (!signer) return alert("Please connect wallet first");

    try {
        const contract = new ethers.Contract(address, ABI, signer);
        const tx = await contract.releaseFunds();
        alert("Release transaction sent! Hash: " + tx.hash);
    } catch (err) {
        console.error(err);
        alert("Error: " + (err.reason || err.message));
    }
};

window.refundClient = async function() {
    const address = document.getElementById('escrowAddress').value;
    if (!ethers.isAddress(address)) return alert("Invalid Contract Address");
    if (!signer) return alert("Please connect wallet first");

    try {
        const contract = new ethers.Contract(address, ABI, signer);
        const tx = await contract.refundClient();
        alert("Refund transaction sent! Hash: " + tx.hash);
    } catch (err) {
        console.error(err);
        alert("Error: " + (err.reason || err.message));
    }
};
