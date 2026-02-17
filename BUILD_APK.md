# Guia de Geração do APK - Minhas Diárias+

## Pré-requisitos

1. **Java Development Kit (JDK)**
   - Instale o JDK 11 ou superior
   - Configure a variável de ambiente `JAVA_HOME`

2. **Android Studio**
   - Instale o Android Studio
   - Configure o SDK do Android
   - Configure a variável de ambiente `ANDROID_SDK_ROOT`

3. **Node.js**
   - Versão 16 ou superior

## Passos para Gerar o APK

### 1. Preparar o Projeto

```bash
npm install
npm run build
```

### 2. Sincronizar com Android

```bash
npm run cap:build
```

Este comando:
- Compila a aplicação React
- Sincroniza os arquivos com o projeto Android
- Atualiza as dependências

### 3. Abrir no Android Studio

```bash
npm run cap:android
```

Ou abra manualmente:
```bash
cd android
./gradlew clean
```

### 4. Gerar o APK de Produção

No Android Studio:

**Opção 1: Via Android Studio UI**
1. Menu `Build` → `Generate Signed Bundle / APK`
2. Selecione `APK`
3. Crie um novo keystore ou use um existente
   - Nome do arquivo: `minhas-diarias.keystore`
   - Password: Use uma senha forte
4. Preenchha os dados:
   - Key alias: `minhas-diarias-key`
   - Key password: Use uma senha forte
5. Release variant: `release`
6. Clique em `Generate`

**Opção 2: Via Linha de Comando**

```bash
cd android
./gradlew bundleRelease
# ou para APK
./gradlew assembleRelease
```

### 5. Arquivos Gerados

- **APK (para instalação direta)**: `android/app/build/outputs/apk/release/app-release.apk`
- **AAB (para Play Store)**: `android/app/build/outputs/bundle/release/app-release.aab`

## Configurações Importantes

### Assinatura Digital

Crie um arquivo `android/key.properties` para automatizar a assinatura:

```properties
storeFile=minhas-diarias.keystore
storePassword=sua-senha-aqui
keyAlias=minhas-diarias-key
keyPassword=sua-senha-aqui
```

### Versionamento

Atualize em `android/app/build.gradle`:

```gradle
android {
    compileSdkVersion 34

    defaultConfig {
        applicationId "com.minhasdiarias.app"
        minSdkVersion 21
        targetSdkVersion 34
        versionCode 1
        versionName "1.0.0"
    }
}
```

## Publicar na Google Play Store

1. Crie uma conta Google Play Developer ($25 - uma vez)
2. Crie um novo app no console
3. Faça upload do arquivo `.aab` (AAB)
4. Preenchha as informações:
   - Descrição
   - Screenshots (mínimo 2)
   - Categoria: Produtividade
   - Classificação etária: Todos os públicos
   - Política de privacidade
5. Revise e publique

## Troubleshooting

### Erro: "ANDROID_SDK_ROOT not found"
```bash
export ANDROID_SDK_ROOT=$HOME/Android/Sdk
```

### Erro: "No SDK found"
- Abra Android Studio
- Vá para `Settings` → `Appearance & Behavior` → `System Settings` → `Android SDK`
- Instale os SDKs necessários (API 21+)

### Erro de Build
```bash
cd android
./gradlew clean
./gradlew build
```

## Segurança

- Nunca compartilhe seu keystore
- Mantenha as senhas seguras
- Use Git para controlar versão, mas adicione `key.properties` ao `.gitignore`

## Distribuição

### Teste Local
```bash
adb install -r android/app/build/outputs/apk/release/app-release.apk
```

### Compartilhamento
- Envie o arquivo `.apk` direto para testes
- Publique na Play Store para distribuição oficial
