export function parseInput(inputs: any) {
    const age = parseInt(inputs.age) ?? 30;
    const province = inputs.province ?? "Wallonie";
    const locale = inputs.locale ?? 'fr-BE'

    return {
        'age': age,
        'province': province,
        'locale': locale,
    }
}
