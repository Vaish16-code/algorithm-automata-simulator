"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface RSAKeys {
  publicKey: { n: number; e: number };
  privateKey: { n: number; d: number };
  p: number;
  q: number;
  phi: number;
}

export default function RSAEncryptionPage() {
  const [p, setP] = useState(7);
  const [q, setQ] = useState(11);
  const [message, setMessage] = useState("HELLO");
  const [keys, setKeys] = useState<RSAKeys | null>(null);
  const [encryptedMessage, setEncryptedMessage] = useState<number[]>([]);
  const [decryptedMessage, setDecryptedMessage] = useState("");
  const [steps, setSteps] = useState<string[]>([]);

  // Helper functions
  const isPrime = (num: number): boolean => {
    if (num < 2) return false;
    for (let i = 2; i <= Math.sqrt(num); i++) {
      if (num % i === 0) return false;
    }
    return true;
  };

  const gcd = (a: number, b: number): number => {
    while (b !== 0) {
      const temp = b;
      b = a % b;
      a = temp;
    }
    return a;
  };

  const modInverse = (a: number, m: number): number => {
    for (let i = 1; i < m; i++) {
      if ((a * i) % m === 1) {
        return i;
      }
    }
    return -1;
  };

  const modPow = (base: number, exp: number, mod: number): number => {
    let result = 1;
    base = base % mod;
    while (exp > 0) {
      if (exp % 2 === 1) {
        result = (result * base) % mod;
      }
      exp = Math.floor(exp / 2);
      base = (base * base) % mod;
    }
    return result;
  };

  const charToNum = (char: string): number => {
    return char.charCodeAt(0) - 65 + 1; // A=1, B=2, ..., Z=26
  };

  const numToChar = (num: number): string => {
    return String.fromCharCode(num + 65 - 1);
  };

  const generateKeys = () => {
    const stepsList: string[] = [];

    // Validate inputs
    if (!isPrime(p)) {
      alert("P must be a prime number!");
      return;
    }
    if (!isPrime(q)) {
      alert("Q must be a prime number!");
      return;
    }
    if (p === q) {
      alert("P and Q must be different!");
      return;
    }

    stepsList.push(`Step 1: Choose two prime numbers p = ${p} and q = ${q}`);

    // Calculate n = p * q
    const n = p * q;
    stepsList.push(`Step 2: Calculate n = p × q = ${p} × ${q} = ${n}`);

    // Calculate φ(n) = (p-1)(q-1)
    const phi = (p - 1) * (q - 1);
    stepsList.push(`Step 3: Calculate φ(n) = (p-1)(q-1) = (${p}-1)(${q}-1) = ${phi}`);

    // Choose e such that 1 < e < φ(n) and gcd(e, φ(n)) = 1
    let e = 3;
    while (e < phi && gcd(e, phi) !== 1) {
      e += 2;
    }
    stepsList.push(`Step 4: Choose e such that gcd(e, φ(n)) = 1. Found e = ${e}`);

    // Calculate d such that (d * e) % φ(n) = 1
    const d = modInverse(e, phi);
    if (d === -1) {
      alert("Could not find modular inverse!");
      return;
    }
    stepsList.push(`Step 5: Calculate d such that (d × e) mod φ(n) = 1. Found d = ${d}`);
    stepsList.push(`Verification: (${d} × ${e}) mod ${phi} = ${(d * e) % phi}`);

    const rsaKeys: RSAKeys = {
      publicKey: { n, e },
      privateKey: { n, d },
      p, q, phi
    };

    setKeys(rsaKeys);
    setSteps(stepsList);
    stepsList.push(`Public Key: (n=${n}, e=${e})`);
    stepsList.push(`Private Key: (n=${n}, d=${d})`);
  };

  const encryptMessage = () => {
    if (!keys) {
      alert("Please generate keys first!");
      return;
    }

    const { n, e } = keys.publicKey;
    const encrypted: number[] = [];
    const stepsList = [...steps];

    stepsList.push(`\nEncryption Process:`);
    stepsList.push(`Message: "${message}"`);
    stepsList.push(`Using Public Key (n=${n}, e=${e})`);

    for (let i = 0; i < message.length; i++) {
      const char = message[i].toUpperCase();
      if (char >= 'A' && char <= 'Z') {
        const m = charToNum(char);
        const c = modPow(m, e, n);
        encrypted.push(c);
        stepsList.push(`'${char}' → ${m} → ${m}^${e} mod ${n} = ${c}`);
      }
    }

    setEncryptedMessage(encrypted);
    setSteps(stepsList);
    stepsList.push(`Encrypted: [${encrypted.join(', ')}]`);
  };

  const decryptMessage = () => {
    if (!keys || encryptedMessage.length === 0) {
      alert("Please encrypt a message first!");
      return;
    }

    const { n, d } = keys.privateKey;
    let decrypted = "";
    const stepsList = [...steps];

    stepsList.push(`\nDecryption Process:`);
    stepsList.push(`Encrypted: [${encryptedMessage.join(', ')}]`);
    stepsList.push(`Using Private Key (n=${n}, d=${d})`);

    for (let i = 0; i < encryptedMessage.length; i++) {
      const c = encryptedMessage[i];
      const m = modPow(c, d, n);
      const char = numToChar(m);
      decrypted += char;
      stepsList.push(`${c} → ${c}^${d} mod ${n} = ${m} → '${char}'`);
    }

    setDecryptedMessage(decrypted);
    setSteps(stepsList);
    stepsList.push(`Decrypted: "${decrypted}"`);
  };

  const reset = () => {
    setKeys(null);
    setEncryptedMessage([]);
    setDecryptedMessage("");
    setSteps([]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">
            RSA Encryption Algorithm
          </h1>
          <p className="text-lg text-gray-200 max-w-3xl mx-auto">
            Learn the RSA public-key cryptosystem with step-by-step key generation, 
            encryption, and decryption. Understand the mathematical foundations of modern cryptography.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Input Controls */}
          <Card>
            <CardHeader>
              <CardTitle>RSA Parameters</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Prime p</label>
                <Input
                  type="number"
                  value={p}
                  onChange={(e) => setP(parseInt(e.target.value) || 7)}
                  className="w-full"
                />
                {!isPrime(p) && <div className="text-red-500 text-xs mt-1">Must be prime!</div>}
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Prime q</label>
                <Input
                  type="number"
                  value={q}
                  onChange={(e) => setQ(parseInt(e.target.value) || 11)}
                  className="w-full"
                />
                {!isPrime(q) && <div className="text-red-500 text-xs mt-1">Must be prime!</div>}
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Message (A-Z only)</label>
                <Input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value.replace(/[^A-Za-z]/g, '').toUpperCase())}
                  placeholder="HELLO"
                  className="w-full"
                />
              </div>

              <div className="space-y-2">
                <Button onClick={generateKeys} className="w-full">
                  1. Generate Keys
                </Button>
                <Button 
                  onClick={encryptMessage} 
                  disabled={!keys}
                  className="w-full"
                >
                  2. Encrypt Message
                </Button>
                <Button 
                  onClick={decryptMessage} 
                  disabled={encryptedMessage.length === 0}
                  className="w-full"
                >
                  3. Decrypt Message
                </Button>
                <Button onClick={reset} variant="outline" className="w-full">
                  Reset
                </Button>
              </div>

              {/* Quick Examples */}
              <div className="space-y-2">
                <h3 className="font-semibold text-sm">Quick Examples:</h3>
                <div className="space-y-1">
                  {[
                    { p: 7, q: 11, msg: "HELLO" },
                    { p: 13, q: 17, msg: "CRYPTO" },
                    { p: 5, q: 23, msg: "RSA" },
                    { p: 11, q: 13, msg: "SECURE" }
                  ].map((example, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setP(example.p);
                        setQ(example.q);
                        setMessage(example.msg);
                        reset();
                      }}
                      className="w-full text-xs justify-start"
                    >
                      p={example.p}, q={example.q}, "{example.msg}"
                    </Button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Results Display */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Results</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Keys Display */}
              {keys && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-green-800 border border-green-600 p-4 rounded-lg">
                    <h3 className="font-semibold text-green-200 mb-2">Public Key</h3>
                    <div className="text-sm text-green-100">
                      <div><strong>n:</strong> {keys.publicKey.n}</div>
                      <div><strong>e:</strong> {keys.publicKey.e}</div>
                    </div>
                    <div className="text-xs text-green-300 mt-2">
                      Used for encryption (can be shared)
                    </div>
                  </div>
                  
                  <div className="bg-red-800 border border-red-600 p-4 rounded-lg">
                    <h3 className="font-semibold text-red-200 mb-2">Private Key</h3>
                    <div className="text-sm text-red-100">
                      <div><strong>n:</strong> {keys.privateKey.n}</div>
                      <div><strong>d:</strong> {keys.privateKey.d}</div>
                    </div>
                    <div className="text-xs text-red-300 mt-2">
                      Used for decryption (keep secret)
                    </div>
                  </div>
                </div>
              )}

              {/* Messages Display */}
              <div className="space-y-3">
                {message && (
                  <div className="bg-blue-800 border border-blue-600 p-3 rounded-lg">
                    <div className="text-sm font-medium text-blue-200">Original Message</div>
                    <div className="font-mono text-lg text-blue-100">{message}</div>
                  </div>
                )}

                {encryptedMessage.length > 0 && (
                  <div className="bg-purple-800 border border-purple-600 p-3 rounded-lg">
                    <div className="text-sm font-medium text-purple-200">Encrypted Message</div>
                    <div className="font-mono text-lg text-purple-100">[{encryptedMessage.join(', ')}]</div>
                  </div>
                )}

                {decryptedMessage && (
                  <div className="bg-green-800 border border-green-600 p-3 rounded-lg">
                    <div className="text-sm font-medium text-green-200">Decrypted Message</div>
                    <div className="font-mono text-lg text-green-100">{decryptedMessage}</div>
                    <div className="text-xs text-green-300 mt-1">
                      {decryptedMessage === message ? "✓ Decryption successful!" : "✗ Decryption failed!"}
                    </div>
                  </div>
                )}
              </div>

              {/* Character Mapping */}
              {keys && (
                <div className="bg-gray-700 border border-gray-600 p-3 rounded-lg">
                  <h3 className="text-sm font-medium mb-2 text-gray-200">Character to Number Mapping</h3>
                  <div className="text-xs grid grid-cols-13 gap-1">
                    {'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').map((char, index) => (
                      <div key={char} className="text-center">
                        <div className="font-bold text-gray-200">{char}</div>
                        <div className="text-gray-300">{index + 1}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Step-by-Step Process */}
          <Card className="lg:col-span-3">
            <CardHeader>
              <CardTitle>Step-by-Step Process</CardTitle>
            </CardHeader>
            <CardContent>
              {steps.length > 0 ? (
                <div className="bg-gray-700 border border-gray-600 p-4 rounded-lg font-mono text-sm max-h-96 overflow-y-auto">
                  {steps.map((step, index) => (
                    <div key={index} className="mb-1 text-gray-200">
                      {step}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-400">
                  No steps to show yet. Start by generating RSA keys.
                </div>
              )}
            </CardContent>
          </Card>

          {/* Algorithm Explanation */}
          <Card className="lg:col-span-3">
            <CardHeader>
              <CardTitle>RSA Algorithm Explanation</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold mb-3">Key Generation Process:</h3>
                  <ol className="space-y-2 text-sm">
                    <li><strong>1. Choose Primes:</strong> Select two large prime numbers p and q</li>
                    <li><strong>2. Calculate n:</strong> Compute n = p × q (public modulus)</li>
                    <li><strong>3. Calculate φ(n):</strong> Compute φ(n) = (p-1)(q-1) (Euler's totient)</li>
                    <li><strong>4. Choose e:</strong> Select e such that gcd(e, φ(n)) = 1</li>
                    <li><strong>5. Calculate d:</strong> Find d such that (d × e) ≡ 1 (mod φ(n))</li>
                    <li><strong>6. Keys:</strong> Public (n,e), Private (n,d)</li>
                  </ol>
                </div>
                <div>
                  <h3 className="font-semibold mb-3">Encryption/Decryption:</h3>
                  <ul className="space-y-2 text-sm">
                    <li><strong>Encryption:</strong> C = M^e mod n</li>
                    <li><strong>Decryption:</strong> M = C^d mod n</li>
                    <li><strong>Security:</strong> Based on difficulty of factoring large numbers</li>
                    <li><strong>Key Size:</strong> Typically 1024, 2048, or 4096 bits</li>
                    <li><strong>Applications:</strong> Digital signatures, secure communication</li>
                    <li><strong>Asymmetric:</strong> Different keys for encryption/decryption</li>
                  </ul>
                </div>
              </div>

              <div className="mt-6 bg-yellow-50 p-4 rounded-lg">
                <h3 className="font-semibold text-yellow-800 mb-2">Important Notes for Exams:</h3>
                <ul className="text-sm space-y-1">
                  <li>• RSA security depends on the difficulty of factoring n = p × q</li>
                  <li>• The private key d is kept secret, while public key (n,e) can be shared</li>
                  <li>• For large messages, RSA is often used to encrypt symmetric keys (hybrid cryptography)</li>
                  <li>• Padding schemes like OAEP are used in practice to prevent attacks</li>
                  <li>• RSA can also be used for digital signatures by reversing the key usage</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
