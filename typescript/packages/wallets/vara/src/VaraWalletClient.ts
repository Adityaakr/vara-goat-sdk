import { GearApi } from "@gear-js/api";
import { Balance, WalletClientBase, Signature } from "@goat-sdk/core";
import { Keyring } from "@polkadot/keyring";
import type { KeyringPair } from "@polkadot/keyring/types";
import type { ISubmittableResult } from "@polkadot/types/types";
import { cryptoWaitReady } from "@polkadot/util-crypto";
import { VaraChainType } from "./types";

export interface VaraWalletClient extends WalletClientBase {
    getChain(): VaraChainType;
    getAddress(): string;
    signMessage(message: string): Promise<Signature>;
    signAndSend(transaction: unknown): Promise<string>;
    balanceOf(address: string): Promise<Balance>;
}

export class VaraKeyringWalletClient implements VaraWalletClient {
    private chain: VaraChainType;
    public api!: GearApi;
    private kp!: KeyringPair;

    constructor(
        private seed: string,
        chain: VaraChainType,
    ) {
        this.chain = chain;
    }

    async init() {
        await cryptoWaitReady();
        const keyring = new Keyring({ type: "sr25519" });
        this.kp = keyring.addFromUri(this.seed);
        this.api = await GearApi.create({ providerAddress: this.chain.rpcUrl });
    }

    async signAndSend(transaction: unknown) {
        return new Promise<string>((res, rej) => {
            // Check if transaction has signAndSend method
            if (typeof transaction === 'object' && transaction !== null && 'signAndSend' in transaction) {
                // Use type assertion to bypass the type checking
                (transaction as any).signAndSend(this.kp, ((result: any) => {
                    if (result.status.isFinalized) res(result.txHash.toHex());
                    if (result.isError) rej(result);
                }) as any);
            } else {
                // If not a proper transaction, create one
                const tx = this.api.tx.balances.transferKeepAlive(
                    (transaction as any).to,
                    (transaction as any).amount
                );
                // Use type assertion to bypass the type checking
                tx.signAndSend(this.kp, ((result: any) => {
                    if (result.status.isFinalized) res(result.txHash.toHex());
                    if (result.isError) rej(result);
                }) as any);
            }
        });
    }

    getAddress(): string {
        return this.kp.address;
    }

    getChain(): VaraChainType {
        return this.chain;
    }

    async signMessage(message: string): Promise<Signature> {
        const signature = this.kp.sign(new TextEncoder().encode(message));
        return {
            signature: Buffer.from(signature).toString('hex')
        };
    }

    async balanceOf(address: string): Promise<Balance> {
        const account = await this.api.query.system.account(address);
        return {
            value: account.data.free.toString(),
            decimals: 12,
            symbol: "VARA",
            name: "Vara",
            inBaseUnits: "true"
        };
    }

    getCoreTools() {
        return [];
    }
}

export const vara = async (seed: string, chain: VaraChainType) => {
    const wallet = new VaraKeyringWalletClient(seed, chain);
    await wallet.init();
    return wallet;
};
