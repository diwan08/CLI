const db = require("./database")
const readline = require("readline")
const clc = require("cli-color")

// initialIZE readline
const rl = readline.createInterface({
    input: process.stdin,
    output:process.stdout
});

const main = () => {
    console.log("### Selamat Datang di PPDBD UNUJA Fakultas Teknik ###");
    console.log("1. Pendaftaran");
    console.log("2. Daftar Mahasiswa Terdaftar");
    rl.question("Silahkan pilih menu di atas :  ", answer => {
        if (answer == 1) {
            registerPPDB()
        }else if (answer == 2) {
            getRegistered()
        }else {
            console.log(clc.red("Anda salah memasukkan inputan"));
            main()
        };
    });
};

const registerPPDB = () => {
    rl.question("masukkan nama anda: ", nama => {
        if (nama.trim().length == 0) {
            console.log(clc.red("nama harus di isi"));
            registerPPDB();
        }else {
            rl.question("masukkan tanggal lahir", tanggal_lahir => {
                if ( tanggal_lahir.trim().length == 0) {
                    console.log(clc.red("tanggal lahir harus di isi"));
                    registerPPDB()
                } else {
                    rl.question("Masukkan jenis kelamin[L/P]: ", jenis_kelamin =>  {
                        if ( jenis_kelamin.trim().length == 0) {
                            console.log(clc.red("Jenis kelamin harus di isi"));
                            registerPPDB() 
                        }else {
                            rl.question("Masukkan prodi yang anda mau [IF, TI , SI , TE, RPL] : " ,async  prodi => {
                                if (prodi.trim().length == 0) {
                                    console.log(clc.red("Prodi harus di isi!!"));
                                    registerPPDB()
                                } else {
                                    await db("pendaftaran")
                                        .insert({
                                            nama,
                                            nim: require("crypto").randomInt(9999999999),
                                            tanggal_lahir,
                                            jenis_kelamin,
                                            prodi
                                        })
                                        .catch(err => {
                                            console.log(clc.red(err.message));
                                            registerPPDB();
                                        });

                                        console.log(clc.greenBright("Selamat anda berhasil mendaftar melalui aplikasi CLI PPDB :) "));
                                        main()
                                }
                            })
                        }

                    })
                }
            })
        }
    })
}
// menu daftar mahasiswa
const getRegistered =async () => {
        const data = await db("pendaftaran").select(db.raw("nama, nim, prodi,DATE_FORMAT(tanggal_lahir,'%d-%m-%Y') as tanggal_lahir"))

    data.forEach(d => {
        console.log("Nama : " + d.nama);
        console.log("Nim : " + d.nim);
        console.log("tanggal_lahir : " + d.tanggal_lahir);
        console.log("prodi : " + d.prodi);
        console.log("\n");
        main()
    });
}

main();