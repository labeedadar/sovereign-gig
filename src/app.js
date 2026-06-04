// Sovereign-Gig Core Logic - Robust Version

const freelancerProfile = {
    min_budget: 500,
    preferred_tech: ["python", "react", "solidity", "ai", "node", "web3"],
    dealbreakers: ["unpaid", "equity only", "homework", "test task", "logo"]
};

// --- Initialization ---
document.addEventListener('DOMContentLoaded', () => {
    console.log("Sovereign-Gig: DOM Loaded. Initializing...");
    loadLocalProfile();
    setupWeb3();
});

// --- Local Storage Management ---
function loadLocalProfile() {
    try {
        const saved = localStorage.getItem('sovereign_profile');
        if (saved) {
            const data = JSON.parse(saved);
            document.getElementById('bankHolder').innerText = data.holder || 'Freelancer Name';
            document.getElementById('bankAccount').innerText = data.account || 'XXXX XXXX XXXX';
            document.getElementById('bankSwift').innerText = data.swift || 'XXXXXXXX';
            document.getElementById('viewPayLink').innerText = data.payLink || 'https://wise.com/pay/me/yourlink';
        }
    } catch (e) {
        console.error("Failed to load profile from LocalStorage", e);
    }
}

window.toggleEditMode = function() {
    console.log("Toggling Edit Mode...");
    const portal = document.getElementById('bankPortal');
    if (!portal) return;
    
    portal.classList.toggle('edit-mode');
    
    if (portal.classList.contains('edit-mode')) {
        document.getElementById('editHolder').value = document.getElementById('bankHolder').innerText;
        document.getElementById('editAccount').value = document.getElementById('bankAccount').innerText;
        document.getElementById('editSwift').value = document.getElementById('bankSwift').innerText;
        document.getElementById('editPayLink').value = document.getElementById('viewPayLink').innerText;
    }
};

window.saveLocalProfile = function() {
    try {
        const data = {
            holder: document.getElementById('editHolder').value,
            account: document.getElementById('editAccount').value,
            swift: document.getElementById('editSwift').value,
            payLink: document.getElementById('editPayLink').value
        };
        
        localStorage.setItem('sovereign_profile', JSON.stringify(data));
        loadLocalProfile();
        toggleEditMode();
        alert("Profile saved locally! Data stays on this device.");
    } catch (e) {
        alert("Error saving profile: " + e.message);
    }
};

// --- Signal Filter ---
window.analyzeSignal = function() {
    const input = document.getElementById('jobInput').value.toLowerCase();
    const resultDiv = document.getElementById('signalResult');
    if (!input) return alert("Please paste text first.");

    let score = 50; 
    let notes = [];

    const matches = freelancerProfile.preferred_tech.filter(t => input.includes(t));
    if (matches.length > 0) { score += 30; notes.push(`✅ Matches: ${matches.join(', ')}`); }

    const violations = freelancerProfile.dealbreakers.filter(d => input.includes(d));
    if (violations.length > 0) { score -= 60; notes.push(`❌ Dealbreaker: ${violations.join(', ')}`); }

    resultDiv.classList.remove('hidden', 'animate-pulse');
    resultDiv.className = `mt-4 p-4 rounded-xl border-2 ${score >= 70 ? 'bg-green-900/30 border-green-500' : (score >= 40 ? 'bg-yellow-900/30 border-yellow-500' : 'bg-red-900/30 border-red-500')}`;
    resultDiv.innerHTML = `<h3 class="font-bold">Score: ${Math.max(0, Math.min(100, score))}/100</h3><ul class="text-xs mt-2">${notes.map(n => `<li>${n}</li>`).join('')}</ul>`;
};

// --- Helpers ---
window.copyBankDetails = function() {
    const text = `Bank Transfer Details:\nHolder: ${document.getElementById('bankHolder').innerText}\nAccount: ${document.getElementById('bankAccount').innerText}\nSWIFT: ${document.getElementById('bankSwift').innerText}`;
    navigator.clipboard.writeText(text);
    alert("Bank details copied!");
};

window.copyPayLink = function() {
    navigator.clipboard.writeText(document.getElementById('viewPayLink').innerText);
    alert("Payment link copied!");
};

// --- Web3 Support ---
let signer;
function setupWeb3() {
    const connBtn = document.getElementById('connectWallet');
    if (!connBtn) return;

    connBtn.onclick = async () => {
        if (window.ethereum) {
            try {
                const provider = new ethers.BrowserProvider(window.ethereum);
                signer = await provider.getSigner();
                const addr = await signer.getAddress();
                document.getElementById('walletStatus').innerText = `Connected: ${addr.substring(0,6)}...`;
            } catch (err) {
                console.error("Wallet connection failed", err);
            }
        } else {
            alert("MetaMask not detected.");
        }
    };
}

window.releaseFunds = async function() {
    if (!signer) return alert("Connect wallet first.");
    const addr = document.getElementById('escrowAddress').value;
    if (!ethers.isAddress(addr)) return alert("Invalid address.");
    try {
        const contract = new ethers.Contract(addr, ["function releaseFunds() external"], signer);
        await contract.releaseFunds();
        alert("Transaction sent!");
    } catch (e) { alert("Error: " + e.message); }
};

window.refundClient = async function() {
    if (!signer) return alert("Connect wallet first.");
    const addr = document.getElementById('escrowAddress').value;
    if (!ethers.isAddress(addr)) return alert("Invalid address.");
    try {
        const contract = new ethers.Contract(addr, ["function refundClient() external"], signer);
        await contract.refundClient();
        alert("Transaction sent!");
    } catch (e) { alert("Error: " + e.message); }
};
