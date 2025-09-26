const addItem = async (item) => {
  const { data, error } = await supabase
    .from('items')
    .insert([item])

  if (error) console.error(error)
  else setItems([...items, ...data])
}
