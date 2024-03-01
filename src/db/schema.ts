// Products Database Schema
const ProductSchema = `
    CREATE TABLE IF NOT EXISTS Products (
        id UUID PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        cost_price FLOAT NOT NULL,
        selling_price FLOAT NOT NULL,
        initial_qty INT NOT NULL DEFAULT 10,
        current_qty INT NOT NULL DEFAULT 0,
        incoming_qty INT NOT NULL DEFAULT 0,
        sold_qty INT NOT NULL DEFAULT 0,
        perishable_qty INT NOT NULL DEFAULT 0,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE OR REPLACE FUNCTION update_updatedAt_column() 
		RETURNS TRIGGER AS $$
		BEGIN
			NEW.updatedAt = now();
			RETURN NEW; 
		END;
		$$ LANGUAGE 'plpgsql';

	CREATE OR REPLACE TRIGGER update_product_modtime 
		BEFORE UPDATE ON Products 
			FOR EACH ROW 
				EXECUTE PROCEDURE update_updatedAt_column();
`;

const TransactionSchema = `
    CREATE TABLE IF NOT EXISTS Transactions (
        transaction_id VARCHAR(18) PRIMARY KEY,
        quantity INT NOT NULL,
        product_id UUID NOT NULL,

        timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
`;

type ProductSchemaInterface = {
	id: string;
	name: string;
	cost_price: number;
	selling_price: number;
	initial_qty: number;
	current_qty: number;
	incoming_qty: number;
	sold_qty: number;
	perishable_qty: number;
	createdAt: string;
	updatedAt: string;
};
type TransactionSchemaInterface = {
	id: string;
	quantity: string;
	product_id: string;
	createdAt: string;
	updatedAt: string;
};

export {
	ProductSchema,
	TransactionSchema,
	ProductSchemaInterface,
	TransactionSchemaInterface,
};
