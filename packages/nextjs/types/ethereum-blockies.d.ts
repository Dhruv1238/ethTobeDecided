declare module 'ethereum-blockies' {
    export function create(options: { seed: string }): {
        toDataURL: () => string;
    };
} 