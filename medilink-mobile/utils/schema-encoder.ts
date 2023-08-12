import { CID } from 'multiformats';
import type { MultihashDigest } from 'multiformats/types/src/cid';
import { wrappedEthers } from 'wrappedEthers';

const isBytesLike = wrappedEthers.utils.isBytesLike;
const AbiCoder = new wrappedEthers.utils.AbiCoder();
const ZERO_ADDRESS = wrappedEthers.constants.AddressZero;

export type SchemaValue =
    | string
    | boolean
    | number
    | bigint
    | Record<string, unknown>
    | Array<Record<string, unknown>>
    | Array<unknown>;
export interface SchemaItem {
    name: string;
    type: string;
    value: SchemaValue;
}

export interface SchemaItemWithSignature extends SchemaItem {
    signature: string;
}

export interface SchemaDecodedItem {
    name: string;
    type: string;
    signature: string;
    value: SchemaItem;
}

const TUPLE_TYPE = 'tuple';
const TUPLE_ARRAY_TYPE = 'tuple[]';

export class SchemaEncoder {
    public schema: Array<SchemaItemWithSignature>;

    constructor(schema: string) {
        this.schema = [];

        const fixedSchema = schema.replace(/ipfsHash/g, 'bytes32');
        const fragment = wrappedEthers.utils.FunctionFragment.from(
            `func(${fixedSchema})`,
        );

        // The following verification will throw in case of an incorrect schema
        AbiCoder.getDefaultValue(fragment.inputs);

        for (const paramType of fragment.inputs) {
            const { name, arrayChildren } = paramType;

            let { type } = paramType;
            let signature = name ? `${type} ${name}` : type;
            const signatureSuffix = name ? ` ${name}` : '';
            let typeName = type;

            const isArray = arrayChildren;
            const components =
                paramType.components ?? arrayChildren?.components ?? [];
            const componentsType = `(${components
                .map((c) => c.type)
                .join(',')})${isArray ? '[]' : ''}`;
            const componentsFullType = `(${components
                .map((c) => (c.name ? `${c.type} ${c.name}` : c.type))
                .join(',')})${isArray ? '[]' : ''}`;

            if (type.startsWith(TUPLE_TYPE)) {
                type = componentsType;
                signature = `${componentsFullType}${signatureSuffix}`;
            } else if (type === TUPLE_ARRAY_TYPE) {
                type = `${componentsType}[]`;
                signature = `${componentsFullType}[]${signatureSuffix}`;
            } else if (type.includes('[]')) {
                typeName = typeName.replace('[]', '');
            }

            this.schema.push({
                name,
                type,
                signature,
                value: type.includes('[]') ? [] : singleValue,
            });
        }
    }

    public decodeData(data: string): Array<SchemaDecodedItem> {
        const values = AbiCoder.decode(this.signatures(), data).toArray();

        return this.schema.map((s, i) => {
            const fragment = wrappedEthers.utils.FunctionFragment.from(
                `func(${s.signature})`,
            );

            if (fragment.inputs.length !== 1) {
                throw new Error(`Unexpected inputs: ${fragment.inputs}`);
            }

            let value = values[i];
            const input = fragment.inputs[0];
            const components =
                input.components ?? input.arrayChildren?.components ?? [];

            if (value.length > 0 && typeof value !== 'string' && components) {
                if (Array.isArray(value[0])) {
                    const namedValues = [];

                    for (const val of value) {
                        const namedValue = [];
                        const rawValues = val
                            .toArray()
                            .filter((v: unknown) => typeof v !== 'object');

                        for (const [k, v] of rawValues.entries()) {
                            const component = components[k];

                            namedValue.push({
                                name: component.name,
                                type: component.type,
                                value: v,
                            });
                        }

                        namedValues.push(namedValue);
                    }

                    value = {
                        name: s.name,
                        type: s.type,
                        value: namedValues,
                    };
                } else {
                    const namedValue = [];
                    const rawValues = value.filter(
                        (v: unknown) => typeof v !== 'object',
                    );

                    for (const [k, v] of rawValues.entries()) {
                        const component = components[k];

                        namedValue.push({
                            name: component.name,
                            type: component.type,
                            value: v,
                        });
                    }

                    value = {
                        name: s.name,
                        type: s.type,
                        value: namedValue,
                    };
                }
            } else {
                value = { name: s.name, type: s.type, value };
            }

            return {
                name: s.name,
                type: s.type,
                signature: s.signature,
                value,
            };
        });
    }

    public static encodeQmHash(hash: string): string {
        const a = CID.parse(hash);
        return AbiCoder.encode(['bytes32'], [a.multihash.digest]);
    }

    public static decodeQmHash(bytes32: string): string {
        const digest = Uint8Array.from(Buffer.from(bytes32.slice(2), 'hex'));
        const dec: MultihashDigest = {
            digest: digest,
            code: 18,
            size: 32,
            bytes: Uint8Array.from([18, 32, ...digest]),
        };

        const dCID = CID.createV0(dec);
        return dCID.toString();
    }
}
