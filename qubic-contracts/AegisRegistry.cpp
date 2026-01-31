#include "AegisRegistry.h"
#include <stdexcept>
#include <algorithm>
#include <iostream>
#include <chrono>
#include <cstring>

// Helper para comparar arrays (direcciones/hash)
bool operator<(const bytes32& a, const bytes32& b) {
    return std::memcmp(a.data(), b.data(), 32) < 0;
}

AegisRegistry::AegisRegistry(address owner) : contractOwner(owner) {}

void AegisRegistry::addVerifier(const address& verifier) {
    // En producción: Solo el owner debería poder añadir verificadores
    verifiers.push_back(verifier);
}

bool AegisRegistry::isVerifier(const address& addr) const {
    for (const auto& v : verifiers) {
        if (v == addr) return true;
    }
    return false;
}

// Generación determinística de ID (Simulada)
bytes32 AegisRegistry::generateAssetId(const address& sender, const std::string& description) {
    // En un contrato real usaríamos hashing criptográfico (SHA256/Keccak)
    // Aquí simulamos llenando los bytes
    bytes32 id = {0};
    std::memcpy(id.data(), sender.data(), std::min((size_t)16, (size_t)32));
    // Usar timestamp o description para variar
    return id; 
}

void AegisRegistry::registerAsset(const address& sender, const std::string& jurisdiction, const std::string& description) {
    if (assets.size() >= MAX_ASSETS) {
        throw std::runtime_error("Max assets limit reached");
    }

    bytes32 newId = generateAssetId(sender, description);
    
    if (assets.find(newId) != assets.end()) {
        throw std::runtime_error("Asset ID collision");
    }

    Asset newAsset;
    newAsset.assetId = newId;
    newAsset.owner = sender;
    newAsset.jurisdiction = jurisdiction;
    newAsset.description = description;
    newAsset.status = AssetStatus::Pending;
    newAsset.isTokenized = false;
    newAsset.totalTokenSupply = 0;

    assets[newId] = newAsset;

    // Inicializar verificación
    Verification newVerification;
    newVerification.assetId = newId;
    newVerification.currentApprovals = 0;
    verifications[newId] = newVerification;

    // Emit AssetRegistered event (simulado)
    // Event::emit("AssetRegistered", newId, sender);
}

void AegisRegistry::approveVerification(const address& sender, const bytes32& assetId) {
    if (!isVerifier(sender)) {
        throw std::runtime_error("Caller is not a verifier");
    }

    auto it = assets.find(assetId);
    if (it == assets.end()) {
        throw std::runtime_error("Asset not found");
    }

    if (it->second.status != AssetStatus::Pending) {
        throw std::runtime_error("Asset is not in pending status");
    }

    Verification& verify = verifications[assetId];

    // Verificar si ya aprobó
    for (const auto& approver : verify.approvers) {
        if (approver == sender) {
            throw std::runtime_error("Verifier already approved this asset");
        }
    }

    verify.approvers.push_back(sender);
    verify.currentApprovals++;

    // Check si se alcanzó el quórum
    if (verify.currentApprovals >= REQUIRED_SIGNATURES) {
        it->second.status = AssetStatus::Verified;
        // Emit AssetVerified event
    }
}

void AegisRegistry::tokenizeAsset(const address& sender, const bytes32& assetId, uint64_t supply) {
    auto it = assets.find(assetId);
    if (it == assets.end()) {
        throw std::runtime_error("Asset not found");
    }

    if (it->second.owner != sender) {
        throw std::runtime_error("Caller is not the asset owner");
    }

    if (it->second.status != AssetStatus::Verified) {
        throw std::runtime_error("Asset not verified");
    }

    if (it->second.isTokenized) {
        throw std::runtime_error("Asset already tokenized");
    }

    if (supply == 0) {
        throw std::runtime_error("Supply must be greater than 0");
    }

    it->second.isTokenized = true;
    it->second.status = AssetStatus::Tokenized;
    it->second.totalTokenSupply = supply;

    // Asignar todo el supply al dueño
    tokenBalances[assetId][sender] = supply;
}

void AegisRegistry::transferTokens(const address& sender, const bytes32& assetId, const address& to, uint64_t amount) {
    auto it = assets.find(assetId);
    if (it == assets.end() || !it->second.isTokenized) {
        throw std::runtime_error("Asset not found or not tokenized");
    }

    uint64_t senderBalance = tokenBalances[assetId][sender];
    if (senderBalance < amount) {
        throw std::runtime_error("Insufficient balance");
    }

    tokenBalances[assetId][sender] -= amount;
    tokenBalances[assetId][to] += amount;
}

const Asset* AegisRegistry::getAssetDetails(const bytes32& assetId) const {
    auto it = assets.find(assetId);
    if (it != assets.end()) {
        return &it->second;
    }
    return nullptr;
}

uint64_t AegisRegistry::getBalance(const bytes32& assetId, const address& account) const {
    auto assetIt = tokenBalances.find(assetId);
    if (assetIt != tokenBalances.end()) {
        auto accIt = assetIt->second.find(account);
        if (accIt != assetIt->second.end()) {
            return accIt->second;
        }
    }
    return 0;
}
