package com.event.test.exception;

import org.springframework.http.HttpStatus;

public class DuplicateEmailException extends ApiException {

	public DuplicateEmailException() {
		super(HttpStatus.CONFLICT, "DUPLICATE_EMAIL",
				"Cette adresse email est deja enregistree pour cet evenement.");
	}
}
