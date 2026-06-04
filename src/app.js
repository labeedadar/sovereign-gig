// Sovereign-Gig Core Logic - Persistence Fix

const freelancerProfile = {
    min_budget: 500,
    preferred_tech: ["python", "react", "solidity", "ai", "node", "web3"],
    dealbreakers: ["unpaid", "equity only", "homework", "test task", "logo"]
};

// --- Storage Keys ---
const STORAGE_KEY = 'sovereign_profile_v1';

// --- Initialization ---
console.log("Sovereign-Gig: Script running...");

// Run immediately
loadLocalProfile();

// Also run on load
document.addEventListener('DOMContentLoaded', () => {
    console.log("Sovereign-Gig: DOM Fully Loaded.");
    loadLocalProfile();
    setupWeb3();
});

// --- Local Storage Management ---
function loadLocalProfile() {
    try {
        const saved = localStorage.getItem(STORAGE_KEY);
        console.log("Attempting to load profile...", saved ? "Data found" : "No data found");
        
        if (saved) {
            const data = JSON.parse(saved);
            
            // Update View Elements safely
            const updateText = (id, val) => {
                const el = document.getElementById(id);
                if (el) el.innerText = val;
            };

            updateText('bankHolder', data.holder || 'Freelancer Name');
            updateText('bankAccount', data.account || 'XXXX XXXX XXXX');
            updateText('bankSwift', data.swift || 'XXXXXXXX');
            updateText('viewPayLink', data.payLink || 'https://wise.com/pay/me/yourlink');
            
            console.log("Profile updated from storage:", data);
        }
    } catch (e) {
        console.error("Failed to load profile", e);
    }
}

window.toggleEditMode = function() {
    console.log("Toggling Edit Mode...");
    const portal = document.getElementById('bankPortal');
    if (!portal) return;
    
    portal.classList.toggle('edit-mode');
    
    if (portal.classList.contains('edit-mode')) {
        // Pre-fill inputs from current view
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
        
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
        console.log("Data saved to LocalStorage:", data);
        
        loadLocalProfile();
        toggleEditMode();
        alert("Profile saved to this device!");
    } catch (e) {
        console.error("Save failed", e);
        alert("Error saving: " + e.message);
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
            console.log("No Ethereum provider found.");
        }
    };
}
