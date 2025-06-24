module.exports = (client) => {
    client.nextLevelUp = async (level) => {
        const base = 100; // XP base para o level 1
        const fator = 1.5; // Crescimento exponencial

        return Math.floor(base * (level ** fator));
    };
};
