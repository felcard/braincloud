require('./db/connection');
const mongoose = require('mongoose');

const Word = mongoose.model('word', {
    text: { type: String, unique: true },
    count: { type: Number, default: 0 }
});

const seed = [
    { "text": "JAVA", "count": 3 },
    { "text": "PYTHON", "count": 6 },
    { "text": "RUBY", "count": 5 },
    { "text": "SWIFT", "count": 4 },
    { "text": "GO", "count": 7 },
    { "text": "C", "count": 4 },
    { "text": "C++", "count": 7 },
    { "text": "JAVASCRIPT", "count": 8 },
    { "text": "PHP", "count": 3 },
    { "text": "TYPESCRIPT", "count": 7 },
    { "text": "KOTLIN", "count": 10 },
    { "text": "SCALA", "count": 2 },
    { "text": "RUST", "count": 3 },
    { "text": "PERL", "count": 9 },
    { "text": "BASH", "count": 1 },
    { "text": "MATLAB", "count": 1 },
    { "text": "SWIFTUI", "count": 9 },
    { "text": "GOLANG", "count": 6 },
    { "text": "C#", "count": 3 },
    { "text": "HTML", "count": 6 },
    { "text": "CSS", "count": 4 },
    { "text": "SQL", "count": 5 },
    { "text": "PERL6", "count": 1 },
    { "text": "JULIA", "count": 7 },
    { "text": "GROOVY", "count": 12 },
    { "text": "BASIC", "count": 6 },
    { "text": "FORTRAN", "count": 8 },
    { "text": "PASCAL", "count": 11 },
    { "text": "ADA", "count": 9 },
    { "text": "F#", "count": 3 },
    { "text": "COBOL", "count": 7 },
    { "text": "LISP", "count": 18 },
    { "text": "OCAML", "count": 1 },
    { "text": "EIFFEL", "count": 2 },
    { "text": "DART", "count": 1 },
    { "text": "ELM", "count": 5 },
    { "text": "CLOJURE", "count": 4 },
    { "text": "HASKELL", "count": 1 },
    { "text": "SCHEME", "count": 2 },
    { "text": "COFFEESCRIPT", "count": 3 },
    { "text": "LUA", "count": 2 },
    { "text": "R", "count": 11 },
    { "text": "GOLO", "count": 3 },
    { "text": "FORTH", "count": 9 },
    { "text": "MUMPS", "count": 7 },
    { "text": "OZ", "count": 6 },
    { "text": "REBOL", "count": 1 },
    { "text": "SOCKET.IO", "count": 1 },
    { "text": "MONGODB", "count": 1 },
    { "text": "REACT", "count": 15 },
    { "text": "ANGULAR", "count": 1 },
    { "text": "RED", "count": 4 },
    // { "text": "HT1ML", "count": 18 },
    // { "text": "CS1S", "count": 4 },
    // { "text": "SQ1L", "count": 5 },
    // { "text": "PE1RL6", "count": 1 },
    // { "text": "JU1LIA", "count": 7 },
    // { "text": "GRO1OVY", "count": 12 },
    // { "text": "BA1SIC", "count": 6 },
    // { "text": "FO1RTRAN", "count": 8 },
    // { "text": "PAS1CAL", "count": 11 },
    // { "text": "ADA1", "count": 9 },
    // { "text": "F1#", "count": 3 },
    // { "text": "CO1BOL", "count": 7 },
    // { "text": "L1ISP", "count": 18 },
    // { "text": "OC1AML", "count": 1 },
    // { "text": "EIF1FEL", "count": 2 },
    // { "text": "DA1RT", "count": 1 },
    // { "text": "EL1M", "count": 5 },
    // { "text": "CLO1JURE", "count": 4 },
    // { "text": "HAS1KELL", "count": 1 },
    // { "text": "SCH1EME", "count": 2 },
    // { "text": "COF1FEESCRIPT", "count": 3 },
    // { "text": "LU1A", "count": 2 },
    // { "text": "1R", "count": 11 },
    // { "text": "G1OLO", "count": 3 },
    // { "text": "FO1RTH", "count": 9 },
    // { "text": "MU1MPS", "count": 7 },
    // { "text": "O1Z", "count": 6 },
    // { "text": "RE1BOL", "count": 1 },
    // { "text": "SO1CKET.IO", "count": 1 },
    // { "text": "MO1NGODB", "count": 1 },
    // { "text": "RE1ACT", "count": 30 },
    // { "text": "ANG1ULAR", "count": 1 },
    // { "text": "R1ED", "count": 4 }
];

// const modSeed = seed.map(word => {
//     word.count = 1;
//     return word;
// });

Word.deleteMany().then(async () => {
    await Word.insertMany(seed);
    //mogoose connection is started in the imported connection file
    //storing the required connection in a db variable and then using
    //db to close the connection works but asyncronicity needs to be handled
    //by doing (await db).disconnect();
    mongoose.disconnect();
});