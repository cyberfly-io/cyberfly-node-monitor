import * as Bip39 from 'bip39';
import { derivePath, getPublicKey } from 'ed25519-hd-key'

export const getKeyPairsFromSeedPhrase = (mnemonic) => {
    const seed = Buffer.from(Bip39.mnemonicToSeedSync(mnemonic)).toString("hex");
    const { key } = derivePath("m/44'/626'/0'", seed);
    return {
      publicKey: getPublicKey(key, false).toString('hex'),
      secretKey: key.toString('hex'),
    };
  };