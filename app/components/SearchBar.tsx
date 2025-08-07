import { View, TextInput, TouchableOpacity } from "react-native";
import React from "react";
import { Search, X } from "lucide-react-native";

const SearchBar = ({ query, setQuery }: { query: string; setQuery: any }) => {
  const handleTextChange = (TextInput: string) => {
    setQuery(TextInput);
  };

  return (
    <View className="flex flex-row mx-2 my-2 p-1 bg-secondary rounded-lg gap-2 items-center">
      <View className="absolute left-2">
        <Search size={20} color={"#a3dcbc"} />
      </View>
      <TextInput
        value={query}
        onChangeText={handleTextChange}
        placeholder={"Search movies/tv shows..."}
        placeholderTextColor={"#efe4ef"}
        selectionColor={"#303e26"}
        className="w-full text-center text-text"
      />
      {query.length > 0 && (
        <TouchableOpacity onPress={() => setQuery("")}>
          <X size={18} color={"#160d15"} />
        </TouchableOpacity>
      )}
    </View>
  );
};

export default SearchBar;
