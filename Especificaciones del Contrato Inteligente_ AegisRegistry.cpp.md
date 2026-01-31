_Este documento proporciona las especificaciones técnicas detalladas para el contrato inteligente `AegisRegistry.cpp`. Está diseñado para ser una guía clara y directa para el desarrollo en C++ sobre la blockchain de Qubic, enfocándose en las características clave del MVP: registro de activos, verificación multi-firma y tokenización._

# Especificaciones del Contrato Inteligente: AegisRegistry.cpp

## 1. Estructuras de Datos (Structs)

Se definirán dos estructuras principales para manejar los activos y el estado de la verificación.

```cpp
// Estructura para representar un Activo del Mundo Real (RWA)
struct Asset {
    bytes32 assetId;          // ID único del activo (ej. hash de los datos iniciales)
    address owner;            // Propietario actual del activo o del contrato de tokens
    string jurisdiction;      // Jurisdicción del activo (ej. "BVI")
    string description;       // Descripción del activo
    uint8 status;             // Estado del activo: 0=Pendiente, 1=Verificado, 2=Tokenizado, 3=Rechazado
    bool isTokenized;         // Flag para indicar si el activo ha sido tokenizado
    address tokenContract;    // Dirección del contrato de tokens (si está tokenizado)
};

// Estructura para gestionar el proceso de verificación
struct Verification {
    bytes32 assetId;
    uint8 requiredApprovals; // Número de aprobaciones requeridas
    mapping(address => bool) hasApproved; // Quién ha aprobado
    address[] approvers;     // Lista de quienes han aprobado
};
```

## 2. Variables de Estado

Estas variables mantendrán el estado de la aplicación en la blockchain.

```cpp
// --- Variables de Configuración (Inmutables) ---
address public contractOwner; // El desplegador del contrato
address[] public verifiers;   // Lista de direcciones de los Verificadores autorizados

uint8 public requiredSignatures; // Número de firmas requeridas para la verificación

// --- Almacenamiento de Datos ---
// Mapeo principal de assetId a la estructura del Activo
mapping(bytes32 => Asset) public assets;

// Mapeo para el proceso de verificación de cada activo
mapping(bytes32 => Verification) public verifications;

// Mapeo para los balances de tokens de cada activo tokenizado
// La primera clave es el assetId, la segunda es la dirección del propietario del token
mapping(bytes32 => mapping(address => uint256)) public tokenBalances;

// Suministro total de tokens para un activo tokenizado
mapping(bytes32 => uint256) public totalTokenSupply;
```

## 3. Eventos

Los eventos son cruciales para que el backend pueda escuchar lo que sucede en la blockchain y activar notificaciones.

```cpp
event AssetRegistered(bytes32 indexed assetId, address indexed owner, string jurisdiction);
event AssetVerified(bytes32 indexed assetId);
event AssetTokenized(bytes32 indexed assetId, uint256 totalSupply);
event VerificationApproved(bytes32 indexed assetId, address indexed verifier);
event TokensTransferred(bytes32 indexed assetId, address indexed from, address indexed to, uint256 amount);
```

## 4. Funciones Principales

### 4.1. Funciones de Registro y Verificación

**`registerAsset(string jurisdiction, string description)`**
- **Visibilidad:** `public`
- **Propósito:** Permite a cualquier usuario registrar un nuevo activo.
- **Lógica:**
    1.  Genera un `assetId` único (ej. `keccak256(abi.encodePacked(msg.sender, block.timestamp, description))`).
    2.  Crea una nueva instancia de `Asset` con `status = 0` (Pendiente) y `owner = msg.sender`.
    3.  Almacena el nuevo `Asset` en el mapping `assets`.
    4.  Crea una nueva instancia de `Verification` para este `assetId`.
    5.  Emite el evento `AssetRegistered`.

**`approveVerification(bytes32 assetId)`**
- **Visibilidad:** `public`
- **Propósito:** Permite a un Verificador autorizado aprobar el registro de un activo.
- **Lógica:**
    1.  Verifica que `msg.sender` es un miembro de la lista `verifiers`.
    2.  Verifica que el `assetId` existe y su estado es `0` (Pendiente).
    3.  Verifica que el `msg.sender` no ha aprobado previamente este activo.
    4.  Registra la aprobación en el mapping `verifications`.
    5.  Emite el evento `VerificationApproved`.
    6.  Comprueba si el número de aprobaciones ha alcanzado `requiredSignatures`. Si es así:
        a.  Actualiza el `status` del activo a `1` (Verificado).
        b.  Emite el evento `AssetVerified`.

### 4.2. Funciones de Tokenización

**`tokenizeAsset(bytes32 assetId, uint256 supply)`**
- **Visibilidad:** `public`
- **Propósito:** Permite al propietario de un activo verificado tokenizarlo.
- **Lógica:**
    1.  Verifica que el `assetId` existe.
    2.  Verifica que `msg.sender` es el `owner` del activo.
    3.  Verifica que el `status` del activo es `1` (Verificado).
    4.  Actualiza el `status` del activo a `2` (Tokenizado) y `isTokenized = true`.
    5.  Establece el `totalTokenSupply` para ese `assetId` al `supply` proporcionado.
    6.  Asigna el `supply` completo de tokens a la dirección del `msg.sender` en el mapping `tokenBalances`.
    7.  Emite el evento `AssetTokenized`.

### 4.3. Funciones de Transferencia de Tokens

**`transferTokens(bytes32 assetId, address to, uint256 amount)`**
- **Visibilidad:** `public`
- **Propósito:** Permite a un propietario de tokens transferir una cantidad a otra dirección.
- **Lógica:**
    1.  Verifica que el activo está tokenizado (`isTokenized == true`).
    2.  Verifica que el balance del `msg.sender` es mayor o igual al `amount`.
    3.  Resta el `amount` del balance del `msg.sender`.
    4.  Suma el `amount` al balance del destinatario (`to`).
    5.  Emite el evento `TokensTransferred`.

### 4.4. Funciones de Consulta (Getters)

Estas funciones son de solo lectura y no consumen gas (o consumen muy poco).

- **`getAssetDetails(bytes32 assetId)`** -> `returns (Asset)`
- **`getVerificationStatus(bytes32 assetId)`** -> `returns (address[], uint8)`
- **`balanceOf(bytes32 assetId, address account)`** -> `returns (uint256)`

## 5. Modificadores (Modifiers)

Para simplificar el código y evitar la repetición, se pueden usar modificadores.

- `onlyOwner(bytes32 assetId)`: Verifica que `msg.sender` es el propietario del activo.
- `onlyVerifier()`: Verifica que `msg.sender` está en la lista de verificadores.
- `isVerified(bytes32 assetId)`: Verifica que el estado del activo es `1` (Verificado).

Este diseño de contrato es modular, claro y cubre todas las características del MVP mejorado. Proporciona una base sólida que puedes expandir fácilmente después del hackathon. La clave durante el evento será implementar estas funciones de manera eficiente y sin errores.
