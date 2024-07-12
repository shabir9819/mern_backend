const createEntity = async (data, Model) => {
  try {
    const newEntity = new Model(data);
    const savedEntity = await newEntity.save();
    return savedEntity; // Return the saved entity
  } catch (error) {
    throw error; // Throw the error to be caught by the caller
  }
};

const getEntities = async (Model) => {
  try {
    const entities = await Model.find().select("-_id -createdAt -updatedAt");
    return entities; // Return the list of entities
  } catch (error) {
    throw error; // Throw the error to be caught by the caller
  }
};

const getEntityById = async (id, Model) => {
  try {
    const entity = await Model.findById(id);
    if (!entity) {
      throw new Error(`${Model.modelName} not found`); // Throw an error if entity is not found
    }
    return entity; // Return the found entity
  } catch (error) {
    throw error; // Throw the error to be caught by the caller
  }
};

const updateEntity = async (id, data, updateData, Model) => {
  try {
    let updatedEntity;

    if (id) {
      updatedEntity = await Model.findByIdAndUpdate(id, updateData, {
        new: true,
      });

      if (!updatedEntity) {
        throw new Error(`${Model.modelName} not found`); // Throw an error if entity is not found
      }
    } else if (data) {
      const updateResult = await Model.updateMany(data, updateData, {
        new: true,
      });

      if (updateResult.nModified === 0) {
        throw new Error(`No ${Model.modelName} found to update`); // Throw an error if no entities were updated
      }

      updatedEntity = await Model.find(data); // Fetch the updated entities
    } else {
      throw new Error(`Invalid update request for ${Model.modelName}`); // Throw an error for invalid update request
    }

    return updatedEntity;
  } catch (error) {
    throw error; // Throw the error to be caught by the caller
  }
};

const deleteEntity = async (id, Model) => {
  try {
    const deletedEntity = await Model.findByIdAndDelete(id);
    if (!deletedEntity) {
      throw new Error(`${Model.modelName} not found`); // Throw an error if entity is not found
    }
    return { message: `${Model.modelName} deleted successfully` }; // Return success message
  } catch (error) {
    throw error; // Throw the error to be caught by the caller
  }
};

const mastersControllers = {
  createEntity,
  updateEntity,
  getEntities,
  getEntityById,
  deleteEntity,
};

export default mastersControllers;
