const oracledb = require('oracledb')

var pool = null
try {
    oracledb.initOracleClient({ libDir: 'C:\\Users\\rober_m72ddjp\\Downloads\\instantclient_21_6' });
} catch (err) {
    console.error('Whoops!');
    console.error(err);
    process.exit(1);
}
var pool = null

async function getPool(con) {
    return new Promise(async (resolve, reject) => {
        if (pool) resolve(pool)
        try {
            pool = await oracledb.createPool(con)
            resolve(pool)
        } catch (error) {
        reject(error)
        }
    });
}


async function q(sql, parametros) {
     let connection;
    try {
        console.log(process.env.ORACLE_USER)
        await getPool({
        user: process.env.ORACLE_USER,
        password: process.env.ORACLE_PASSWORD,
        connectString: process.env.ORACLE_CN,
        poolAlias: "Proyecto"
        })        
            connection = await oracledb.getConnection("Proyecto");
            const result = await connection.execute(
                sql,
                parametros, { outFormat: oracledb.OBJECT },
        );
        return (result.rows);
    } catch (err) {
        console.log(err)
        return err;
    } finally {
        if (connection) {
            try {
                await connection.close();
            } catch (err) {
                return err;
            }
        }
    }
}

module.exports = {
    q
}