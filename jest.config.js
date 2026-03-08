module.exports = {
    transform: {
        '^.+\\.ts?$': 'ts-jest'
        },
    //collectCoverage: true,

};

module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  collectCoverageFrom: [
    "Game_mechanics/**/*.{js,ts}",
    "API/**/*.{js,ts}",
    "!lib/**" // Utropstecknet betyder "exkludera detta"
  ],
};