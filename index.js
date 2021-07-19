//Framework
const express = require("express");

//Database
const database = require("./Database/index");

//initializing express
const Paradigm = express();

//configuration 
Paradigm.use(express.json());

// shows all the books in the database
// info to be written on every api so, that other developers will know what it is and all


//using get method, we recieve from database and using reponse we post back to server
//By using nodemon i.e. npx nodemon index after installing it instead of just node index, we dont have to stop and start the server again and again, every time we save the changes, the server gets restarted automatically.

/*
Route :  /(root)
Description : to get all books
Access : Public
Parameters: None
Method : Get
*/


Paradigm.get("/", (req,res)=>{
return res.json({books: database.books});
});

//to get specific book from the database from url's isbn no.

/*
Route :  /is/
Description : to get specified books
Access : Public
Parameters: isbn
Method : Get
*/

Paradigm.get("/is/:isbn",(req,res)=>{
const getSpecificBook = database.books.filter((book)=>book.ISBN === req.params.isbn);

if(getSpecificBook.length === 0)
{
    return res.json({error: `No book found for the ISBN of ${req.params.isbn}`});
}

return res.json({book: getSpecificBook});

});


/*
Route :  /c
Description : to get specific book based on a category
Access : Public
Parameters: category
Method : Get
*/

Paradigm.get("/c/:category",(req, res) => {
const getSpecificBooks = database.books.filter((book)=>book.category.includes(req.params.category)
);


//include get the value and match it with the category array but only if contains only strings

if(getSpecificBooks.length === 0)
{
    return res.json({error: `No book found for the category of ${req.params.category}`});
}

return res.json({Category: getSpecificBooks});

});

//to get specific books based on author

/*
Route :  /author/books
Description : to get specific book based on a author
Access : Public
Parameters: id
Method : Get
*/

Paradigm.get("/books/author/:id",(req, res) => {
    const getBookBySpecificAuthor = database.books.filter((book)=>book.author.includes(req.params.id));
    
    //include get the value and match it with the category array but only if contains only strings
    
    if(getBookBySpecificAuthor.length === 0)
    {
        return res.json({error: `No book found for the author ${req.params.id}`});
    }
    
    return res.json({"book by author with given id's": getBookBySpecificAuthor});
    
    });
    
//AUTHOR


/*
Route :  /author
Description : to get all author
Access : Public
Parameters: 
Method : Get
*/

Paradigm.get("/author",(req, res) => {
   
    return res.json({author: database.author});
});

    
/*
Route :  /author
Description : to get a specific author based on id
Access : Public
Parameters: id
Method : Get
*/

Paradigm.get("/author/:id",(req, res) => {
    const getBookBySpecificAuthors = database.author.filter((author)=>author.id===req.params.id);    
    if(getBookBySpecificAuthors.length === 0)
    {
        return res.json({error: `No author found with given id: ${req.params.id}`});
    }
    
    return res.json({Authors: getBookBySpecificAuthors});
    
    });
    
//to get a list of authors based on a book

/*
Route :  /author
Description : to get a  list of authors based on a book
Access : Public
Parameters: id
Method : Get
*/

Paradigm.get("/author/books/:isbn",(req, res) => {
    const getListOfAllBooksBySpecificAuthors = database.author.filter((author)=>author.books.includes(req.params.isbn));    
    if(getListOfAllBooksBySpecificAuthors.length === 0)
    {
        return res.json({error: `No author found for given book: ${req.params.isbn}`});
    }
    
    return res.json({"List of Authors based on given book" : getListOfAllBooksBySpecificAuthors});
    
    });


//PUBLICATIONS

/*
Route :  /publication/
Description : to get all publications
Access : Public
Parameters: 
Method : Get
*/

Paradigm.get("/publication",(req,res) => {
    return res.json({Publications : database.publication});
});



/*
Route :  /publication/
Description : to get specific publication
Access : Public
Parameters: id
Method : Get
*/

Paradigm.get("/publication/:id",(req,res) => {
    const getSpecificPublication = database.publication.filter((pub)=> pub.id===req.params.id);
    if(getSpecificPublication.length===0)
    {
        return res.json({error: `No publication found with given id ${req.params.id}`});
    }
    return res.json({" Publications having given id": getSpecificPublication});
});


/*
Route :  /publication/books/
Description : to get a list of publications based on a book
Access : Public
Parameters: isbn
Method : Get
*/

Paradigm.get("/publication/books/:isbn",(req,res)=>{
    const getListOfPublicationsBasedonBook = database.publication.filter((pubspec) => pubspec.books.includes(req.params.isbn));

    if(getListOfPublicationsBasedonBook.length === 0)
    {
        return res.json({error: `List of publications related to given book no. ${req.params.isbn} was not found`});
    }

    return res.json({"List of publications related to given book no. " : getListOfPublicationsBasedonBook});
});


/*
Route :  /books/new/
Description : to upload/add a new book
Access : Public
Parameters: none
Method : Post
*/


Paradigm.post("/books/new",(req,res)=>{
const {newBook}= req.body;
database.books.push(newBook);
return res.json({Books : database.books, message: "New Books was added!!"});
});

/*
Route :  /books/update/
Description : to update the title of book
Access : Public
Parameters: isbn
Method : Put
*/

Paradigm.put("/books/update/:isbn",(req,res)=>{
//using for each we can directly modify the array from database and if we use map, we will get new array and it will get tedious
database.books.forEach((book)=>{
    if(book.ISBN === req.params.isbn){
        book.title = req.body.bookTitle;
        book.pubDate = req.body.newPubDate;
        book.language= req.body.newLang;
        book.numPage=req.body.newNumPage;
        return;
    }
});
return res.json({Books: database.books});
});

/*
Route :  /author/new/
Description : to upload/add a new author
Access : Public
Parameters: none
Method : Post
*/

Paradigm.post("/author/new",(req,res)=>{
const {newauthor}=req.body;
database.author.push(newauthor);
return res.json({Authors: database.author, message: "New author was added!!"});
});



/*
Route :  /books/author/update/
Description : to update the author in both author and books
Access : Public
Parameters: isbn
Method : Put
*/
Paradigm.put("/books/author/update/:isbn",(req,res)=>{
//updating book database
database.books.forEach((book)=>{
    if(book.ISBN === req.params.isbn)
     return book.author.push(req.body.newAuthor);
});

//updating authors database
database.author.forEach((author)=>{
if(author.id === req.body.newAuthor)
 return author.books.push(req.params.isbn);
});

return res.json({Books: database.books,Author: database.author, message: "New Author was added!!!"});
});


/*
Route :  /publication/new/
Description : to upload/add a new publication
Access : Public
Parameters: none
Method : Post
*/

Paradigm.post("/publication/new",(req,res)=>{
    const {newPublication}=req.body;
    database.publication.push(newPublication);
    return res.json({Publications: database.publication, message: "New publication was added!!"});
    });



/*
Route :  /books/publication/update/
Description : update/add a new book to the publication in both books and publication
Access : Public
Parameters: isbn
Method : PUT
*/

Paradigm.put("/books/publication/update/:isbn",(req,res)=>{
    database.books.forEach((book)=>{
        if(book.ISBN===req.params.isbn)
            return book.publications.push(req.body.newPublication);
    });
    database.publication.forEach((public)=>{
        if(public.id===req.body.newPublication)
        return public.books.push(req.params.id);
    });

    return res.json({Books: database.books, Publications : database.publication, message: "New Publication was added!!"})
});


Paradigm.listen(3000, () => console.log("Server is running"));