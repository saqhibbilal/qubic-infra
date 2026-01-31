#pragma once

#include <cstdint>
#include <string>
#include <vector>
#include <map>
#include <array>

// Definiciones de tipos para simular el entorno Qubic/Blockchain si no están en el SDK local
// En un entorno real de Qubic, estos vendrían de <qubic.h>
using bytes32 = std::array<uint8_t, 32>;
using address = std::array<uint8_t, 32>; // Asumiendo direcciones de 32 bytes (clave pública)
using uint256_t = std::array<uint64_t, 4>; // Simulación básica de 256 bits

// Constantes del Protocolo
constexpr uint8_t REQUIRED_SIGNATURES = 2;
constexpr uint64_t MAX_ASSETS = 1000000;

// Estados del Activo
enum class AssetStatus : uint8_t {
    Pending = 0,
    Verified = 1,
    Tokenized = 2,
    Rejected = 3
};

// Estructura del Activo
struct Asset {
    bytes32 assetId;
    address owner;
    std::string jurisdiction;
    std::string description;
    AssetStatus status;
    bool isTokenized;
    address tokenContract; // Si aplica, o 0x0
    uint64_t totalTokenSupply; // Añadido aquí para simplificar acceso
};

// Estructura de Verificación
struct Verification {
    bytes32 assetId;
    uint8_t currentApprovals;
    std::vector<address> approvers; // Lista de quienes han aprobado
    // En C++ usamos un std::set o vector para verificar existencia, no mapping directo
};

class AegisRegistry {
private:
    address contractOwner;
    std::vector<address> verifiers;
    
    // Almacenamiento principal
    std::map<bytes32, Asset> assets;
    std::map<bytes32, Verification> verifications;
    
    // Balances: AssetId -> (OwnerAddress -> Balance)
    std::map<bytes32, std::map<address, uint64_t>> tokenBalances;

public:
    AegisRegistry(address owner);
    
    // Gestión de Verificadores
    void addVerifier(const address& verifier);
    bool isVerifier(const address& addr) const;

    // Funciones Principales
    void registerAsset(const address& sender, const std::string& jurisdiction, const std::string& description);
    void approveVerification(const address& sender, const bytes32& assetId);
    void tokenizeAsset(const address& sender, const bytes32& assetId, uint64_t supply);
    void transferTokens(const address& sender, const bytes32& assetId, const address& to, uint64_t amount);

    // Getters
    const Asset* getAssetDetails(const bytes32& assetId) const;
    uint64_t getBalance(const bytes32& assetId, const address& account) const;
    
private:
    // Helpers internos
    bytes32 generateAssetId(const address& sender, const std::string& description);
};
