function stop_timer(table) {
    console.log("AFK fold");
    io.to(table.id).emit("i fold", "FOLD", get_private_id(get_table(table.id, tables).private_ids, get_table(table.id, tables).game.highlights_pos), 0);
}
