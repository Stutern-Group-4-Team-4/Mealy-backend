const properties = require('../model/property')



class propertyController{
   //create new property
  static async createProperty(req, res){
    try {
        const {title, type, location, desc, price, beds, baths, featured} = req.body;
        const propertyExists = await properties.find({title})
        if(propertyExists.length>0){
            throw new Error('property already exists')
        }

        const newProperty = {
            title: req.body.title,
            type: req.body.type,
            location: req.body.location,
            desc: req.body.desc,
            price: req.body.price,
            beds: req.body.baths,
            baths: req.body.baths,
            featured: req.body.featured
        }

        const new_property = await properties.create(newProperty)
        res.status(201).json({
            status: "Success",
            message: "A new property has been created",
            data: {
                newProperty: new_property
            }
        })

    } catch (error) {
        return res.status(500).json(error.message)
    }
}

//get all 
static async getAllProperties(req, res){
    try{
        const allProperties = await properties.find({})
        return res.status(200).json(allProperties)
    }catch(error){
        return res.status(500).json(error.message)
    }
}


//get featured
static async getFeatured (req, res){
    try{
        const featuredProperties = await properties.find({featured: true})
        return res.status(200).json(featuredProperties)
    }catch(error){
        return res.status(500).json(error.message)
    }
}

//get all from a single type
static async getAllFromType(req, res){
    const type = req.query
    try {
        if(type){
            const type_properties = await properties.find({type})
            return res.status(200).json(type_properties)
        }else{
            return res.status(500).json({msg: 'No such type found'})
        }
    } catch (error) {
        return res.status(500).json(error.message)
    }
}


//get counts of type
static async getCounts(req, res){
    try {
        const landType = await properties.countDocuments({type: 'land'})
        const houseType = await properties.countDocuments({type: 'house'})
        const shortletType = await properties.countDocuments({type: 'shortlet'})
        const rentType = await properties.countDocuments({type: 'rent'})
        const soldType = await properties.countDocuments({type: 'sold'})

        return res.status(200).json({
            land: landType,
            house: houseType,
            shortlet: shortletType,
            rent: rentType,
            sold: soldType
        })
    } catch (error) {
        return res.status(500).json(error.message)
    }
}

//get individual property 
static async getSingleProperty (req, res){
    try {
        const Property = await properties.findById(req.params.id)
        if(!Property){
            throw new Error('No such property with this id')
        }else{
            return res.status(200).json(Property)
        }
    } catch (error) {
        return res.status(500).json(error.message)
    }
}

//delete property
// propertyController.delete('/:id', (req, res)=>{
//     try {
//         const property = await property.findById(req.params.id)
        
//     } catch (error) {
//         return res.status(500).json(error.message)
//     }
// })
}


module.exports = propertyController