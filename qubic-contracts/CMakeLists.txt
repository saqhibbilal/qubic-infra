cmake_minimum_required(VERSION 3.10)
project(AegisRegistry)

set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED True)

# En un entorno real de Qubic, aquí se incluirían las librerías del SDK
# include_directories(${QUBIC_SDK_INCLUDE_DIRS})

# Archivos fuente
set(SOURCES
    AegisRegistry.cpp
    AegisRegistry.h
)

# Crear ejecutable (o librería para despliegue real)
add_library(AegisRegistry ${SOURCES})

# Opcional: Crear un ejecutable de prueba si quisieras correr tests locales
# add_executable(test_contract tests/test_main.cpp ${SOURCES})
