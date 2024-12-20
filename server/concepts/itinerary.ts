import { ObjectId } from "mongodb";
import DocCollection, { BaseDoc } from "../framework/doc";
import { NotAllowedError, NotFoundError } from "./errors";

export interface ItineraryDoc extends BaseDoc {
  author: ObjectId; // Original creator
  collaborators: string[]; // Other editors as usernames
  content: string;
}

/**
 * Handles itinerary-related operations.
 */
export default class ItineraryConcept {
  public readonly itineraries: DocCollection<ItineraryDoc>;

  /**
   * Creates an instance of ItineraryConcept.
   * @param collectionName - Name of the collection in the database.
   */
  constructor(collectionName: string) {
    this.itineraries = new DocCollection<ItineraryDoc>(collectionName);
  }

  /**
   * Creates a new itinerary.
   * @param author - The author of the itinerary.
   * @param content - The content of the itinerary.
   * @returns The created itinerary.
   */
  async create(author: ObjectId, content: string) {
    const _id = await this.itineraries.createOne({ author, collaborators: [], content });
    return { msg: "Itinerary successfully created!", itinerary: await this.itineraries.readOne({ _id }) };
  }

  /**
   * Retrieves all itineraries.
   * @returns An array of itineraries.
   */
  async getAllItineraries() {
    return await this.itineraries.readMany({}, { sort: { createdAt: -1 } });
  }

  /**
   * Retrieves itineraries by author.
   * @param author - The author of the itineraries.
   * @returns An array of itineraries by the specified author.
   */
  async getByAuthor(author: ObjectId) {
    return await this.itineraries.readMany({ author });
  }

  /**
   * Retrieves an itinerary by its ID.
   * @param itineraryId - The ID of the itinerary.
   * @returns The itinerary.
   */
  async getItineraryById(itineraryId: ObjectId) {
    const itinerary = await this.itineraries.readOne({ _id: itineraryId });
    if (!itinerary) {
      throw new NotFoundError(`Itinerary ${itineraryId} not found`);
    }
    return itinerary;
  }

  /**
   * Updates an itinerary.
   * @param itineraryId - The ID of the itinerary to update.
   * @param collaboratorUsername - The username of the collaborator to add (optional).
   * @param content - The new content of the itinerary (optional).
   * @returns The updated itinerary.
   */
  async updateItinerary(itineraryId: ObjectId, collaboratorUsername?: string, content?: string) {
    if (!collaboratorUsername && !content) {
      throw new Error("At least one field (collaboratorUsername or content) must be provided to update.");
    }

    const updatedData: Partial<ItineraryDoc> = {};

    const itinerary = await this.getItineraryById(itineraryId);

    // Ensure collaborators is always an array of usernames
    itinerary.collaborators = Array.isArray(itinerary.collaborators) ? itinerary.collaborators : [];

    if (content) updatedData.content = content;

    if (collaboratorUsername && !itinerary.collaborators.includes(collaboratorUsername)) {
      itinerary.collaborators.push(collaboratorUsername); // Add new collaborator only if not already present
      updatedData.collaborators = itinerary.collaborators;
    }

    await this.itineraries.partialUpdateOne({ _id: itineraryId }, updatedData);
    return { msg: "Itinerary successfully updated!", itinerary: await this.getItineraryById(itineraryId) };
  }

  /**
   * Deletes an itinerary by its ID.
   * @param itineraryId - The ID of the itinerary to delete.
   * @returns A confirmation message.
   */
  async deleteItinerary(itineraryId: ObjectId) {
    await this.itineraries.deleteOne({ _id: itineraryId });
    return { msg: "Deleted itinerary" };
  }

  /**
   * Checks if the user is allowed to edit the itinerary.
   * @param itineraryId - The ID of the itinerary.
   * @param user - The user ID.
   * @param username - The username of the user.
   * @throws ItineraryAuthorNotMatchError if the user is not the author or a collaborator.
   */
  async assertAuthorIsAllowedToEdit(itineraryId: ObjectId, user: ObjectId, username: string) {
    const itinerary = await this.getItineraryById(itineraryId);

    // Check if the author matches the user ObjectId
    if (itinerary.author.toString() !== user.toString()) {
      // Check if the username is in the collaborators array
      if (!itinerary.collaborators.includes(username)) {
        throw new ItineraryAuthorNotMatchError(user, itineraryId);
      }
    }
  }
}

/**
 * Error thrown when a user is not the author of an itinerary.
 */
export class ItineraryAuthorNotMatchError extends NotAllowedError {
  constructor(
    public readonly author: ObjectId,
    public readonly _id: ObjectId,
  ) {
    super(`${author} is not the author of itinerary ${_id}!`);
  }
}
