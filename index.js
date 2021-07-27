require("dotenv").config(); //should be first l

//Framework
const express = require("express");


//Way to react with MOngo DB and aur application
const mongoose = require("mongoose");


//Database
const database = require("./Database/index");


//initializing express
const Paradigm = express();

//configuration 
Paradigm.use(express.json());

// shows all the books in the database
// info to be written on every api so, that other developers will know what it is and all

//Establish Connection with MongoDB database
//mongodb+srv://Rutuja_5113:IEhdF3h4pepJwLPO@nosqldbmanagement.ocjuv.mongodb.net/Paradigm?retryWrites=true&w=majority  we cant write it this way as it is exposing sensitive information, so we will download a package dotenv for application security
// we should store this type of data in environment variables so that this information wont be exposed

//process is processor/runtime
mongoose.connect(process.env.MONGO_URL,
{
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true
}
).then(
    ()=>console.log("Connection Established")
);


//using get method, we recieve from database and using reponse we post back to server
//By using nodemon i.e. npx nodemon index after installing it instead of just node index, we dont have to stop and start the server again and again, every time we save the changes, the server gets restarted automatically.



//BOOKS

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
Route :  /books/delete/
Description : to delete a book
Access : Public
Parameters: isbn
Method : Delete
*/  
Paradigm.delete("/books/delete/:isbn",(req,res)=>{
const updatedBookDatabase = database.books.filter(
(book) => book.ISBN !== req.params.isbn
);
database.books = updatedBookDatabase;
return res.json({Updated_List_of_books: database.books});
});
//we should change the database objets to let because if const then we wont be able to replace it.
//Also, in filter new array will be created which will not contain the given param



 /*
Route :  /books/delete/author
Description : delete a book from a author
Access : Public
Parameters: isbn,authorId
Method : Delete
*/    

Paradigm.delete("/books/delete/author/:isbn/:authorId",(req,res)=>{
//update the book database
//use foreach first because we are not replacing whole database, just one preoperty inside the database
database.books.forEach((book)=>{
    if(book.ISBN === req.params.isbn){
        const newAuthorList = book.author.filter(
            (author)=> author!== req.params.authorId
        );
        book.author=newAuthorList;
        return;
    }
});

//update author database

database.author.forEach((author1)=>{
    if(author1.id === req.params.authorId){
        const newBookList = author1.books.filter(
            (book)=> book !== req.params.isbn
        );

        author1.books = newBookList;
        return;
    }
});

return res.json({book: database.books, Author: database.author, message: "The author was deleted succesfully"});

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
Route :  /author/delete/
Description : to delete a auhtor
Access : Public
Parameters: id
Method : Delete
*/ 
Paradigm.delete("/author/delete/:id",(req,res)=>{
    const updatedAuthorList = database.author.filter(
        (authors)=>authors.id !== req.params.id
    );
    database.author=updatedAuthorList;
    res.json({Updated_List_of_authors: database.author, message: "Desired author was deleted successfully!!"});
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
        return public.books.push(req.params.isbn);
    });

    return res.json({Books: database.books, Publications : database.publication, message: "New Publication was added!!"})
});

/*
Route :  /publication/delete/
Description : to delete a publication
Access : Public
Parameters: id
Method : Delete
*/ 

Paradigm.delete("/publication/delete/:id",(req,res)=>{
    const updatedListofPublication = database.publication.filter(
        (publi)=>publi.id!==req.params.id
    );
    database.publication=updatedListofPublication;
    res.json({Updated_List_of_Publication : database.publication, message: "Desired publication was deleted successfully!!"});
});


/*
Route :  /publication/books/delete/
Description : to delete a publication from book and publication both databases
Access : Public
Parameters: id,isbn
Method : Delete
*/ 

Paradigm.delete("/publication/books/delete/:id/:isbn",(req,res)=>{
//updating books database
database.publication.forEach((publication1)=>
{
    if(publication1.id===req.params.id){
        const newpublist = publication1.books.filter(
          (book)=>book!==req.params.isbn  
        );

        publication1.books= newpublist;
        return;
    }
});
//updating publications database
database.books.forEach((book)=>{
    if(book.ISBN===req.params.isbn){
        const newupdatedlist=book.publications.filter(
            (pub)=>pub!==req.params.id
        );

        book.publications=newupdatedlist;
        return;
    }
});

return res.json({Updated_List_Of_Publications: database.publication, Updated_List_Of_Books : database.books, message: "Publications were deleted!!!" })

});

Paradigm.listen(3000, () => console.log("Server is running"));


//We need someone to talk to mongodb in which mongodb understands us => Mongoose
//we need something to talk to us in the way we understand => JavaScript