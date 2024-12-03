function part1(instructions) {
    const match_valid_muls = new RegExp(
        `mul\\((?<left>[0-9]+),(?<right>[0-9]+)\\)`,
        'g',
    );
    return instructions.matchAll(match_valid_muls)
        .map(match => {
            const left = parseInt(match.groups.left);
            const right = parseInt(match.groups.right);
            return left * right;
        })
        .reduce((acc, curr) => acc + curr, 0);
}

function part2(instructions) {
    const commands_regexp = new RegExp(
        `(?<cmd>mul)\\((?<left>[0-9]+),(?<right>[0-9]+)\\)|(?<cmd>don't)\(\)|(?<cmd>do)\(\)`,
        'g',
    );
    let result = 0;

    const matches = instructions.matchAll(commands_regexp);
    let mulEnabled = true;
    for (const { groups: { left, right, cmd } } of matches) {
        switch (cmd) {
            case `do`:
                mulEnabled = true;
                break;
            case `don't`:
                mulEnabled = false;
                break;
            case `mul`:
                if (mulEnabled) {
                    result += left * right;
                }
                break;
        }
    }
    return result;
}

const input = await (await fetch('https://adventofcode.com/2024/day/3/input')).text();
console.log(part2(input));
