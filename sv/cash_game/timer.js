function stop_timer(table) {
    console.log("AFK fold");
    console.log('first private id ' + get_private_id(table.private_ids, table.game.highlights_pos));
    console.log('second private id ' + get_private_id(get_table(table.id, tables).private_ids, get_table(table.id, tables).game.highlights_pos));
    io.to(table.id).emit("i fold", "FOLD", get_private_id(table.private_ids, table.game.highlights_pos), 0);
}
