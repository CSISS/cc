package edu.gmu.csiss.earthcube.cyberconnector.search;

import java.util.ArrayList;
import java.util.List;

import edu.gmu.csiss.earthcube.cyberconnector.products.Product;

/**
*Class SearchResponse.java
*@author Ziheng Sun
*@time Feb 3, 2017 10:43:29 AM
*Original aim is to support CyberConnector.
*/
public class SearchResponse {

	/**
	 * The following three variables are added for JQuery DataTable
	 * Refer to https://datatables.net/manual/server-side
	 */
	
	int draw;
	
	int recordsTotal;
	int recordsFiltered;

	List<Product> products;

	public SearchResponse() {
		this.products = new ArrayList<>();
	}
	
	public int getRecordsTotal() {
		return recordsTotal;
	}

	public void setRecordsTotal(int recordsTotal) {
		this.recordsTotal = recordsTotal;
	}

	public int getRecordsFiltered() {
		return recordsFiltered;
	}

	public void setRecordsFiltered(int recordsFiltered) {
		this.recordsFiltered = recordsFiltered;
	}

	public int getDraw() {
		return draw;
	}

	public void setDraw(int draw) {
		this.draw = draw;
	}

	public List<Product> getProducts() {
		return products;
	}

	public void setProducts(List<Product> products) {
		this.products = products;
	}
	
}
