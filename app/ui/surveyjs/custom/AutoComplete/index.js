import React from "react";
import { HiSearch, HiLocationMarker } from "react-icons/hi";
import useAutoComplete from "./use-autocomplete";

export default function AutoComplete({ handleChange }) {
  /* const Options = [
  { value: "1", label: "John" },
  { value: "2", label: "Jack" },
  { value: "3", label: "Jane" },
  { value: "4", label: "Mike" },
];
  const {
    bindInput,
    bindOptions,
    bindOption,
    isBusy,
    suggestions,
    selectedIndex,
  } = useAutoComplete({
    onChange: (value) => console.log(value),
    source: (search) =>
      Options.filter((option) =>
        new RegExp(`^${search}`, "i").test(option.label)
      ),
  });*/
  const {
    bindInput,
    bindOptions,
    bindOption,
    isBusy,
    suggestions,
    selectedIndex,
  } = useAutoComplete({
    onChange: handleChange,
    delay: 1000,
    source: async (search) => {
      try {
        const res = await fetch(
          `https://api.getaddress.io/autocomplete/${search}?api-key=mbA3xi-KwEqkOSYaYXJfgw41481`
        );
        const data = await res.json();
        const suggestions = data.suggestions;
        return suggestions.map((d) => ({ value: d.id, label: d.address }));
      } catch (e) {
        return [];
      }
    },
  });
  return (
    <div className="p-2 border">
      <div className="flex items-center w-full">
        <HiSearch />
        <input
          placeholder="Search"
          className="flex-grow px-1 outline-none"
          {...bindInput}
        />
        {isBusy && (
          <div className="w-4 h-4 border-2 border-dashed rounded-full border-slate-500 animate-spin"></div>
        )}
      </div>
      <ul
        {...bindOptions}
        className="w-[70%] z-50 bg-white shadow-md mt-3 scroll-smooth absolute max-h-[260px] overflow-x-hidden overflow-y-auto"
      >
        {suggestions.map((_, index) => (
          <li
            className={
              `flex items-center h-[40px] p-3 hover:bg-slate-300 ` +
              (selectedIndex === index && "bg-slate-300")
            }
            key={index}
            {...bindOption}
          >
            <div className="flex items-center space-x-1">
              <HiLocationMarker />
              <div>{suggestions[index].label}</div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
