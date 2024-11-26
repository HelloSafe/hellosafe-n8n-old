export function parseInput(inputs: any) {
    const duration = inputs.duration ?? "10";
    const amount = parseInt(inputs.amount) ?? 20000;

    return {
        'duration': duration,
        'amount': amount,
    };
}
