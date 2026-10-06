import { randomBytes, pbkdf2Sync } from 'node:crypto';
import { createInterface } from 'node:readline/promises';
import { Writable } from 'node:stream';
// Read a password without displaying it or putting it in shell history.
let muted = false;
const output = new Writable({write(chunk, encoding, callback) { if (!muted) process.stdout.write(chunk); callback(); }});
const rl = createInterface({input: process.stdin, output, terminal: process.stdin.isTTY});
process.stdout.write('New admin password: '); muted = true;
const password = await rl.question(''); rl.close(); process.stdout.write('\n');
if (password.length < 12) throw new Error('Use a password of at least 12 characters.');
const salt = randomBytes(16).toString('hex');
console.log(`pbkdf2$100000$${salt}$${pbkdf2Sync(password, salt, 100000, 32, 'sha256').toString('hex')}`);
