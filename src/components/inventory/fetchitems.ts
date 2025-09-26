useEffect(() => {
  const fetchItems = async () => {
    const { data, error } = await supabase
      .from('items')
      .select('*')
      .order('updated_at', { ascending: false })

    if (error) console.error(error)
    else setItems(data)
  }

  fetchItems()
}, [])
