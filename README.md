# Fuzzy Bookmarks

![GitHub](https://img.shields.io/github/license/atEaE/fuzzy-bookmarks)
![GitHub release (latest by date)](https://img.shields.io/github/v/release/atEaE/fuzzy-bookmarks)
![GitHub Workflow Status (branch)](https://img.shields.io/github/workflow/status/atEaE/fuzzy-bookmarks/Release%20Fuzzy%20Bookmarks/master)
![GitHub issues](https://img.shields.io/github/issues-raw/atEaE/fuzzy-bookmarks)
![GitHub pull requests](https://img.shields.io/github/issues-pr/atEaE/fuzzy-bookmarks)

### ⚠️Attention️️⚠️

`Fuzzy Bookmark` is currently in **beta**. Please note that the commands and the format of the saved files may be different when it is officially released.

This is an extension that allows you to register various things as bookmarks and call them up easily.  
Register your frequently used files, URLs, and folders for a comfortable "VSCode Life"!

## Features

- Easily register "file", "folder", and "url" as bookmarks.
- Quickly search and browse Bookmarks from the command palette.

## Usage

### 1. Setup

First, let's do the setup.  
Create a destination folder(`~/.vscode/fzb`) and destination file(`bookmarks.json`) based on the default set values.  
Open the Command Pallet and search for `FzB: Setup Fuzzy Bookmarks`.

### 2. Register Bookmark

After the setup is complete, let's register Bookmark.  
Open the Command Pallet and search for `FzB: Register Bookmarks`.  
It is possible to register　URLs(`http://` or `https://` schema), Files and Direcotries.  
The value you enter will be automatically recognized as a URL, file, or directory.
If the file does not exist, or if you enter a value with an unidentified schema, the registration will not take place.

### 3. Show Bookmarks

Finally, let's check the values we registered!  
Open the Command Pallet and search for `FzB: Show Bookmarks`.  
All you have to do is select one of the registered bookmarks.

## Commands

### 1. FzB: Setup Fuzzy Bookmarks

Perform setup to use the extension.

### 2. FzB: Register Bookmarks

Register your bookmark.

### 3. FzB: Show Bookmarks

You can refer to pre-registered bookmarks.

### 4. FzB: Remove Bookmarks

You can delete the Bookmarks you have registered.

### 5. FzB: Export Bookmarks

Outputs the saved Bookmarks to a file.

## Contributing

Pull requests and stars are always welcome.  
Contributions are what make the open source community such an amazing place to be learn, inspire, and create.   
Any contributions you make are greatly appreciated.

1. Fork the Project.
2. Create your Feature Branch(`git checkout -b feature/amazing_feature`).
3. Commit your Changes(`git commit -m 'Add some changes'`).
4. Push to the Branch(`git push origin feature/amazing_feature`).
5. Open a Pull Request.
  
## Author

- [atEaE](https://github.com/atEaE)

## Spectial Thanks

- Icons made by [Freepik](https://www.freepik.com) from [www.flaticon.com](https://www.flaticon.com/). Thank you so much for offering this for free.

## License

MIT. Click [here](./LICENSE) for details.
