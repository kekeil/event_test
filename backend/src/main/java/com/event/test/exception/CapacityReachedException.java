package com.event.test.exception;

import org.springframework.http.HttpStatus;

public class CapacityReachedException extends ApiException {

	public CapacityReachedException() {
		super(HttpStatus.UNPROCESSABLE_ENTITY, "CAPACITY_REACHED", "Cet evenement est complet.");
	}
}
