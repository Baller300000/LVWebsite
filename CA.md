# Complete Guide: Building a Personal Certificate Authority (CA) on Windows 11

This guide explains how to create a local **Root Certificate Authority (CA)** on Windows 11 and issue trusted SSL/TLS certificates for internal servers, home labs, or local development sites.

---

## Prerequisites: Installing OpenSSL on Windows 11

Windows 11 does not include OpenSSL out of the box, though you may already have it if you use Git for Windows. To install it cleanly via the built-in Windows Package Manager (`winget`), open **PowerShell** and run:

```powershell
winget install ShiningLight.OpenSSL.Light
```

*Note: After installation, **close and reopen PowerShell** so Windows refreshes your `PATH` environment variable and recognizes the `openssl` command.*

---

## Directory Structure Setup

Create an organized folder structure in your user profile (`C:\Users\<YourUsername>\my-ca`) to keep your sensitive Root CA key separated from generated server certificates.

Run these commands in **PowerShell**:

```powershell
New-Item -ItemType Directory -Force -Path "$HOME\my-ca\root", "$HOME\my-ca\certs", "$HOME\my-ca\csr"
Set-Location "$HOME\my-ca"
```

* **`root\`**: Stores your Root CA private key and public root certificate.
* **`certs\`**: Stores the final signed certificates and private keys for your websites/servers.
* **`csr\`**: Stores Certificate Signing Requests (`.csr`) and extension config files (`.ext`).

---

## Step 1: Create the Root CA Private Key

The Root CA private key is the cryptographic foundation of your trust chain. Anyone with access to this file can generate trusted certificates impersonating any website on your Windows machine.

```powershell
openssl genrsa -aes256 -out root\ca.key 4096
```

### Lock Down File Permissions on Windows
Restrict NTFS file permissions so only your Windows user account can read `ca.key`:

```powershell
icacls "root\ca.key" /inheritance:r /grant:r "${env:USERNAME}:(R)"
```

### Command & Flag Breakdown

| Flag / Argument | Meaning & Purpose |
| :--- | :--- |
| **`genrsa`** | Instructs OpenSSL to generate an RSA private key. |
| **`-aes256`** | Encrypts the private key using the AES-256 cipher. OpenSSL will prompt you to create and confirm a strong passphrase. |
| **`-out root\ca.key`** | Specifies the output file path for the generated private key. |
| **`4096`** | Sets the key size to **4096 bits**. Root CAs use 4096-bit keys (instead of 2048-bit) because they remain valid for many years and require stronger cryptographic protection. |
| **`icacls ...`** | Native Windows command that removes inherited folder permissions (`/inheritance:r`) and grants Read-only (`R`) access exclusively to your current user account. |

---

## Step 2: Create the Self-Signed Root Certificate

Use your private key to generate the public Root Certificate (`ca.crt`). This is the file you will import into Windows and share with any other devices that need to trust your certificates.

```powershell
openssl req -x509 -new -key root\ca.key -sha256 -days 3650 -out root\ca.crt `
  -subj "/C=US/ST=California/L=SanFrancisco/O=HomeLab/OU=IT/CN=HomeLab Root CA"
```
*(Note: The backtick `` ` `` at the end of the first line is PowerShell's line-continuation character).*

### Command & Flag Breakdown

| Flag / Argument | Meaning & Purpose |
| :--- | :--- |
| **`req`** | Invokes OpenSSL's PKCS#10 certificate request and certificate generating utility. |
| **`-x509`** | Outputs a self-signed X.509 certificate instead of a certificate signing request. |
| **`-new`** | Generates a new certificate request. |
| **`-key root\ca.key`** | Specifies the private key used to sign this root certificate (you will be prompted for your AES-256 passphrase). |
| **`-sha256`** | Uses the SHA-256 hash algorithm for the digital signature. Older hashes like SHA-1 are blocked by modern browsers. |
| **`-days 3650`** | Sets the certificate lifespan in days (`3650` days = **10 years**). Long lifespans avoid having to frequently re-import the Root CA across devices. |
| **`-out root\ca.crt`** | Output path for the public Root CA certificate. |
| **`-subj "..."`** | Non-interactively fills out the certificate's Distinguished Name (DN) fields. |

### Subject (`-subj`) Field Values
Customize these values to match your setup:
* **`/C=`**: **Country Name** (2-letter ISO code, e.g., `US`, `GB`, `DE`, `GR`).
* **`/ST=`**: **State or Province Name** (full name, e.g., `California`).
* **`/L=`**: **Locality Name** (city name, e.g., `SanFrancisco`).
* **`/O=`**: **Organization Name** (your company, group, or lab name, e.g., `HomeLab`).
* **`/OU=`**: **Organizational Unit** (department or division, e.g., `IT`).
* **`/CN=`**: **Common Name** (the display name shown inside the Windows Certificate Manager, e.g., `HomeLab Root CA`).

---

## Step 3: Trust Your Root CA on Windows 11

Windows browsers (Edge, Chrome, Brave) rely on the native **Windows Certificate Store**. Firefox uses its own store by default, though it can be configured to trust Windows certificates too.

### 1. Import into the Windows Root Store (PowerShell as Administrator)
Open **PowerShell as Administrator**, navigate to `$HOME\my-ca`, and run:

```powershell
Import-Certificate -FilePath "root\ca.crt" -CertStoreLocation Cert:\LocalMachine\Root
```

#### PowerShell Cmdlet Breakdown

| Parameter | Value & Purpose |
| :--- | :--- |
| **`Import-Certificate`** | Native Windows PowerShell cmdlet for importing X.509 certificates. |
| **`-FilePath`** | Path to your public Root CA certificate (`root\ca.crt`). |
| **`-CertStoreLocation`** | `Cert:\LocalMachine\Root` places the certificate into the **Trusted Root Certification Authorities** store for all users and browsers on the PC. *(Use `Cert:\CurrentUser\Root` if you do not have Administrator rights).* |

*(Optional GUI method: Double-click `ca.crt` in File Explorer -> **Install Certificate...** -> **Local Machine** -> **Place all certificates in the following store** -> **Browse** -> **Trusted Root Certification Authorities**).*

### 2. Enable Windows Certificate Trust in Firefox (Optional)
If you use Mozilla Firefox on Windows 11:
1. Open Firefox and type `about:config` in the address bar (click **Accept the Risk and Continue**).
2. Search for **`security.enterprise_roots.enabled`**.
3. Double-click it to set its value to **`true`**. Firefox will now automatically trust everything in your Windows Trusted Root store.

---

## Step 4: Generate a Server Private Key & CSR

Whenever you want to secure a local website or service (e.g., `myapp.local`), generate a unique private key and a **Certificate Signing Request (CSR)** for that service.

```powershell
openssl req -new -nodes -newkey rsa:2048 `
  -keyout certs\myapp.local.key `
  -out csr\myapp.local.csr `
  -subj "/C=US/ST=California/L=SanFrancisco/O=HomeLab/OU=Servers/CN=myapp.local"
```

### Command & Flag Breakdown

| Flag / Argument | Meaning & Purpose |
| :--- | :--- |
| **`-new`** | Creates a new Certificate Signing Request. |
| **`-nodes`** | Short for **"No DES"**. Saves the server private key **without a passphrase** so web servers (IIS, Nginx, Apache, Docker containers) can start automatically without human password entry. |
| **`-newkey rsa:2048`** | Generates a new **2048-bit RSA** private key alongside the CSR. 2048 bits is the industry standard for leaf server certificates. |
| **`-keyout ...`** | Output path for the server's private key. Keep this file secret on the target server. |
| **`-out ...`** | Output path for the Certificate Signing Request (`.csr`). |

---

## Step 5: Create a Subject Alternative Name (SAN) Config

Modern browsers **ignore the Common Name (`CN`)** when checking domain names. They strictly require a **Subject Alternative Name (SAN)** extension listing every valid domain and IP address.

Run this PowerShell block to generate `csr\myapp.local.ext` cleanly using UTF-8 encoding (avoiding Windows UTF-16 BOM issues that break OpenSSL):

```powershell
@"
authorityKeyIdentifier=keyid,issuer
basicConstraints=CA:FALSE
keyUsage = digitalSignature, nonRepudiation, keyEncipherment, dataEncipherment
extendedKeyUsage = serverAuth
subjectAltName = @alt_names

[alt_names]
DNS.1 = myapp.local
DNS.2 = *.myapp.local
DNS.3 = localhost
IP.1 = 127.0.0.1
IP.2 = 192.168.1.50
"@ | Set-Content -Path "csr\myapp.local.ext" -Encoding ASCII
```

### Extension Parameter Breakdown

| Parameter | Value & Purpose |
| :--- | :--- |
| **`authorityKeyIdentifier`** | `keyid,issuer` — Cryptographically links this certificate back to your Root CA certificate. |
| **`basicConstraints`** | `CA:FALSE` — Marks this as an end-entity (leaf) certificate. It cannot sign other certificates. |
| **`keyUsage`** | Restricts cryptographic usage to digital signatures (`digitalSignature`) and session key encryption (`keyEncipherment`). |
| **`extendedKeyUsage`** | `serverAuth` — Authorizes the certificate for TLS web server authentication. (Use `clientAuth` for mTLS client certificates). |
| **`subjectAltName`** | References the `[alt_names]` block below it. |
| **`DNS.1`, `DNS.2`, ...** | Lists exact hostnames or single-level wildcards (`*.myapp.local`). Add `DNS.4`, etc., as needed. |
| **`IP.1`, `IP.2`, ...** | Lists IP addresses if you browse to the service via IP (e.g., `https://192.168.1.50`). |

---

## Step 6: Sign the Server Certificate with Your Root CA

Sign the server's CSR using your Root CA key, Root CA certificate, and the SAN extension file:

```powershell
openssl x509 -req -in csr\myapp.local.csr `
  -CA root\ca.crt `
  -CAkey root\ca.key `
  -CAcreateserial `
