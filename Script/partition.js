/*
    Trouvé les partitions ...
    Exemple : 
        5 = 1+1+1+1+1
        5 = 2+1+1+1
        5 = 2+2+1
        5 = 3+1+1
        5 = 3+2
        5 = 4+1
        5 = 5 NON & pas de doublons
*/

//------------------------------------------
//   Générateur de partitions (GAME CORE)
//------------------------------------------

export function trouverPartitions(n) {
    const result = [];
    const partition = [];

    if (n <= 0) return result;

    function backtrack(start, target) {
        if (target === 0) {
            result.push([...partition]);
            return;
        }

        for (let i = start; i <= target; i++) {
            partition.push(i);
            backtrack(i, target - i);
            partition.pop();
        }
    }

    backtrack(1, n);
    return result;
}