import database from "/infra/database.js";

async function status(request, response) {
  const updatedAt = new Date().toISOString();

  const PostVersion = await database.query("SHOW server_version;");
  const PostVersionValue = PostVersion.rows[0].server_version;

  const PostVersionMax = await database.query("SHOW max_connections;");
  const PostVersionMaxrows = PostVersionMax.rows[0].max_connections;

  const databaseName = process.env.POSTGRES_DB;
  const PostVersionUsed = await database.query({
    text: "SELECT COUNT(*)::int FROM pg_stat_activity WHERE datname = $1;",
    values: [databaseName],
  });

  const databaseOpnedConnectionsValue = PostVersionUsed.rows[0].count;

  response.status(200).json({
    updated_at: updatedAt,
    dependencies: {
      database: {
        version: PostVersionValue,
        max_connections: parseInt(PostVersionMaxrows),
        opened_connections: databaseOpnedConnectionsValue,
      },
    },
  });
}

export default status;
