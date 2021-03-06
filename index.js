require("dotenv").config(); //should be first l

//Framework
const express = require("express");


//Way to react with MOngo DB and aur application
const mongoose = require("mongoose");


//Database
const database = require("./Database/index");

//we have to include models

const BookModel = require("./Database/book");
const AuthorModel = require("./Database/author");
const PublicationModel = require("./Database/publication");

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

Paradigm.get("/", async (req,res)=>{
    const getAllBooks = await BookModel.find();
return res.json({books: getAllBooks});
});

/*
Paradigm.get("/", (req,res)=>{
return res.json({books: database.books});
});

*/
/*
Route :  /is/
Description : to get specified books
Access : Public
Parameters: isbn
Method : Get
*/

Paradigm.get("/is/:isbn", async (req,res)=>{
    const getSpecificBook = await BookModel.findOne({ISBN: req.params.isbn});
/*const getSpecificBook = database.books.filter((book)=>book.ISBN === req.params.isbn);*/
//getSpecificBook.length === 0
// In mongoDB dont find data it returns null --> False
if(!getSpecificBook)
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

Paradigm.get("/c/:category", async (req, res) => {
const getCategory = await BookModel.findOne({
    category: req.params.category
});
    /*
const getCategory = database.books.filter((book)=>book.category.includes(req.params.category)
);*/
//getCategory.length === 0
//include get the value and match it with the category array but only if contains only strings
if(!getCategory)
{
    return res.json({error: `No book found for the category of ${req.params.category}`});
}
return res.json({Category: getCategory});
});

/*
Route :  /author/books
Description : to get specific book based on a author
Access : Public
Parameters: id
Method : Get
*/

Paradigm.get("/books/author/:id",async (req, res) => {

    const getBookBySpecificAuthor = await BookModel.findOne({
        author : req.params.id
    });

    //const getBookBySpecificAuthor = database.books.filter((book)=>book.author.includes(req.params.id)); 
    //include get the value and match it with the category array but only if contains only strings   

    if(!getBookBySpecificAuthor)
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


Paradigm.post("/books/new",async (req,res)=>{
    const {newBook}= req.body;

    BookModel.create(newBook);

   // database.books.push(newBook);
    return res.json({message: "New Books was added!!"});
    });
    

/*
    Route :  /books/update/
    Description : to update the title of book
    Access : Public
    Parameters: isbn
    Method : Put
*/
    
Paradigm.put("/books/update/:isbn",async (req,res)=>{
//using for each we can directly modify the array from database and if we use map, we will get new array and it will get tedious

const updatedBook = await BookModel.findOneAndUpdate(
{
    ISBN: req.params.isbn,//object to find
},
{
    title: req.body.bookTitle,
    pubDate: req.body.newPubDate,
    language: req.body.newLang,
    numPage:req.body.newNumPage,
},
{
    new: true,//to get newly updated data, it's not compulsory
});

 database.books.forEach((book)=>{
 if(book.ISBN === req.params.isbn){
    book.title = req.body.bookTitle;
    book.pubDate = req.body.newPubDate;
    book.language= req.body.newLang;
    book.numPage=req.body.newNumPage;
    return;
    }
});
return res.json({UpdatedBooks: updatedBook});
});


/*
Route :  /books/delete/
Description : to delete a book
Access : Public
Parameters: isbn
Method : Delete
*/  


Paradigm.delete("/books/delete/:isbn",async (req,res)=>
{
const deleteBook = await BookModel.findOneAndDelete({
    ISBN: req.params.isbn
});
/*    
const updatedBookDatabase = database.books.filter(
(book) => book.ISBN !== req.params.isbn
);
database.books = updatedBookDatabase;//replacing with updated array*/
return res.json({DeletedBook: deleteBook});
}
);


//we should change the database objets to let because if const then we wont be able to replace it.
//Also, in filter new array will be created which will not contain the given param




 /*
Route :  /books/delete/author
Description : delete a book from a author
Access : Public
Parameters: isbn,authorId
Method : Delete
*/    

Paradigm.delete("/books/delete/author/:isbn/:authorId",async (req,res)=>{
//update the book database
//findOneAndUpdate because we are just deletinf from array and not whole book
const updateBook = await BookModel.findOneAndUpdate(
{
    ISBN : req.params.isbn
},
{
    $pull: {
        author: req.params.authorId
    }
},
{
    new: true
});
/*
//use foreach first because we are not replacing whole database, just one preoperty inside the database

database.books.forEach((book)=>{
    if(book.ISBN === req.params.isbn){
        const newAuthorList = book.author.filter(
            (author)=> author!== req.params.authorId
        );
        book.author=newAuthorList;
        return;
    }
});*/

//update author database

const updateAuthors = await AuthorModel.findOneAndUpdate(
{
    id: req.params.authorId
},
{
    $pull:{
        books: req.params.isbn
    }
},
{
    new: true
});
/*
database.author.forEach((author1)=>{
    if(author1.id === req.params.authorId){
        const newBookList = author1.books.filter(
            (book)=> book !== req.params.isbn
        );

        author1.books = newBookList;
        return;
    }
});*/

return res.json({book: updateBook, Author: updateAuthors, message: "The author was deleted succesfully"});

});









//AUTHOR


/*
Route :  /author
Description : to get all author
Access : Public
Parameters: 
Method : Get
*/

Paradigm.get("/author",async (req, res) => {
   const getAllAuthors = await AuthorModel.find();
    return res.json({author: getAllAuthors});
});

    
/*
Route :  /author
Description : to get a specific author based on id
Access : Public
Parameters: id
Method : Get
*/

Paradigm.get("/author/:id",async (req, res) => {
    const getBookBySpecificAuthors =await  AuthorModel.findOne({id:req.params.id});
    //const getBookBySpecificAuthors = database.author.filter((author)=>author.id===req.params.id);    
    if(!getBookBySpecificAuthors)
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

Paradigm.get("/author/books/:isbn",async (req, res) => {

        const getListOfAllBooksBySpecificAuthors = await AuthorModel.find({
            books : req.params.isbn
        });
    //const getListOfAllBooksBySpecificAuthors = database.author.filter((author)=>author.books.includes(req.params.isbn));    
    if(!getListOfAllBooksBySpecificAuthors)
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

Paradigm.post("/author/new",async (req,res)=>{
    const {newauthor}=  req.body;
    AuthorModel.create(newauthor);
   // database.author.push(newauthor);
    return res.json({message: "New author was added!!"});
    });
    
    
    
/*
  Route :  /books/author/update/
  Description : to update or add the author in both author and books
  Access : Public
  Parameters: isbn
  Method : Put
*/

Paradigm.put("/books/author/update/:isbn",async (req,res)=>{
//updating book database
const updateAuthorInBook = await BookModel.findOneAndUpdate({
    ISBN: req.params.isbn
},
{
    $addToSet:{
        author: req.body.newAuthor,
    }
},
{
    new : true,
}
);
/*
database.books.forEach((book)=>{
    if(book.ISBN === req.params.isbn)
    return book.author.push(req.body.newAuthor);
});
    */
//updating authors database

const UpdateAuthorInAuthor = await AuthorModel.findOneAndUpdate(
    {
        id: req.body.newAuthor,
    },
    {
        $addToSet: {
            books: req.params.isbn,
        }
    },
    {
        new: true,
    }
);

/*
database.author.forEach((author)=>{
if(author.id === req.body.newAuthor)
   return author.books.push(req.params.isbn);
});*/
    
return res.json({Books: updateAuthorInBook,Author: UpdateAuthorInAuthor, message: "New Author was added!!!"});
});





 
/*
Route :  /author/delete/
Description : to delete a auhtor
Access : Public
Parameters: id
Method : Delete
*/ 
Paradigm.delete("/author/delete/:id", async(req,res)=>{
    const updatedAuthorList = await AuthorModel.findOneAndDelete({
        id : req.params.id
    });
    /*
    const updatedAuthorList = database.author.filter(
        (authors)=>authors.id !== req.params.id
    );
    database.author=updatedAuthorList;*/
    res.json({Updated_List_of_authors: updatedAuthorList, message: "Desired author was deleted successfully!!"});
});








//PUBLICATIONS

/*
Route :  /publication/
Description : to get all publications
Access : Public
Parameters: 
Method : Get
*/

Paradigm.get("/publication",async (req,res) => {
    const getNewPublication = await PublicationModel.find();
    return res.json({Publications : getNewPublication});
});



/*
Route :  /publication/
Description : to get specific publication
Access : Public
Parameters: id
Method : Get
*/

Paradigm.get("/publication/:id",(req,res) => {

    const getSpecificPublication = PublicationModel.findOne({
        id : req.params.id
    });
  //  const getSpecificPublication = database.publication.filter((pub)=> pub.id===req.params.id);
    if(!getSpecificPublication)
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

Paradigm.get("/publication/books/:isbn",async (req,res)=>{

    const getListOfPublicationsBasedonBook = await PublicationModel.find({
        books : req.params.isbn
    });
    //const getListOfPublicationsBasedonBook = database.publication.filter((pubspec) => pubspec.books.includes(req.params.isbn));

    if(!getListOfPublicationsBasedonBook)
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
    PublicationModel.create(newPublication);
   // database.publication.push(newPublication);
    return res.json({Publications: PublicationModel, message: "New publication was added!!"});
    });



/*
Route :  /books/publication/update/
Description : update/add a new book to the publication in both books and publication
Access : Public
Parameters: isbn
Method : PUT
*/


Paradigm.put("/books/publication/update/:isbn", async (req,res)=>{

    const addNewPublicationinBook = await BookModel.findOneAndUpdate({
        ISBN: req.params.isbn,
    },
    {
        $addToSet:{
            publications: req.body.newPublication
        }
    },
    {
        new: true
    });
    /*database.books.forEach((book)=>{
        if(book.ISBN===req.params.isbn)
            return book.publications.push(req.body.newPublication);
    });*/
    const addNewBookinPublication = await PublicationModel.findOneAndUpdate({
        id: req.body.newPublication,
    },
    {
        $addToSet:{
            books: req.params.isbn
        }
    },
    {
        new: true
    });
    /*
    database.publication.forEach((public)=>{
        if(public.id===req.body.newPublication)
        return public.books.push(req.params.isbn);
    });*/

    return res.json({Books: addNewPublicationinBook, Publications : addNewBookinPublication, message: "New Publication was added!!"})
});

/*
Route :  /publication/delete/
Description : to delete a publication
Access : Public
Parameters: id
Method : Delete
*/ 

Paradigm.delete("/publication/delete/:id",async(req,res)=>{

    const updatedListofPublication = await PublicationModel.findOneAndDelete({
        id : req.params.id
    });
    /*
    const updatedListofPublication = database.publication.filter(
        (publi)=>publi.id!==req.params.id
    );
    database.publication=updatedListofPublication;*/
    res.json({Updated_List_of_Publication : updatedListofPublication, message: "Desired publication was deleted successfully!!"});
});


/*
Route :  /publication/books/delete/
Description : to delete a publication from book and publication both databases
Access : Public
Parameters: id,isbn
Method : Delete
*/ 

Paradigm.delete("/publication/books/delete/:id/:isbn",async (req,res)=>{
//updating books database

const updatePublication = await PublicationModel.findOneAndUpdate({
    id : req.params.id
},
{
    $pull : {
        books: req.params.isbn
    }
},
{
    new: true
});
/*
database.publication.forEach((publication1)=>
{
    if(publication1.id===req.params.id){
        const newpublist = publication1.books.filter(
          (book)=>book!==req.params.isbn  
        );

        publication1.books= newpublist;
        return;
    }
});*/

//updating publications database

const updateBooks = await BookModel.findOneAndUpdate({
    ISBN : req.params.isbn
},
{
    $pull : {
        publications: req.params.id
    }
},
{
    new: true
});

/*
database.books.forEach((book)=>{
    if(book.ISBN===req.params.isbn){
        const newupdatedlist=book.publications.filter(
            (pub)=>pub!==req.params.id
        );

        book.publications=newupdatedlist;
        return;
    }
});
*/
return res.json({Updated_List_Of_Publications: updatePublication, Updated_List_Of_Books : updateBooks, message: "Publications were deleted!!!" })

});

Paradigm.listen(3000, () => console.log("Server is running"));


//We need someone to talk to mongodb in which mongodb understands us => Mongoose
//we need something to talk to us in the way we understand => JavaScript