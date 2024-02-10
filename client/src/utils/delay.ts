function delay(seconds: number): Promise<void> {
    return new Promise<void>(resolve => {
      setTimeout(() => {
        resolve();
      }, seconds);
    });
  }
export {delay}  