const updateItem = async (id, newQuantity) => {
  const { data, error } = await supabase
    .from('items')
    .update({ quantity: newQuantity, updated_at: new Date() })
    .eq('id', id)

  if (error) console.error(error)
  else setItems(items.map(i => i.id === id ? { ...i, quantity: newQuantity } : i))
}
